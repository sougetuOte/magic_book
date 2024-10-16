import React, { useState, useEffect } from 'react';
import './DiaryDetail.css';

const DiaryDetail = ({ id, onClose, isEditing, onEdit }) => {
  const [diary, setDiary] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    weather: '',
    constellation: '',
    content: '',
    practiceItems: [],
    images: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [newImage, setNewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (id) {
      fetchDiary();
    }
  }, [id]);

  const fetchDiary = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/diaries/${id}`);
      if (!response.ok) {
        throw new Error('日記の取得に失敗しました');
      }
      const data = await response.json();
      setDiary(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiary(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handlePracticeItemChange = (index, field, value) => {
    const newPracticeItems = [...diary.practiceItems];
    newPracticeItems[index][field] = value;
    setDiary(prev => ({ ...prev, practiceItems: newPracticeItems }));
  };

  const addPracticeItem = () => {
    setDiary(prev => ({
      ...prev,
      practiceItems: [...prev.practiceItems, { title: '', description: '' }]
    }));
  };

  const removePracticeItem = (index) => {
    setDiary(prev => ({
      ...prev,
      practiceItems: prev.practiceItems.filter((_, i) => i !== index)
    }));
  };

  const validateField = (name, value) => {
    let errors = { ...validationErrors };
    switch (name) {
      case 'title':
        if (!value.trim()) {
          errors.title = 'タイトルは必須です';
        } else if (value.length > 100) {
          errors.title = 'タイトルは100文字以内で入力してください';
        } else {
          delete errors.title;
        }
        break;
      case 'date':
        if (!value) {
          errors.date = '日付は必須です';
        } else {
          delete errors.date;
        }
        break;
      case 'content':
        if (!value.trim()) {
          errors.content = '内容は必須です';
        } else if (value.length > 1000) {
          errors.content = '内容は1000文字以内で入力してください';
        } else {
          delete errors.content;
        }
        break;
      default:
        break;
    }
    setValidationErrors(errors);
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!diary.title.trim()) {
      errors.title = 'タイトルは必須です';
      isValid = false;
    }
    if (!diary.date) {
      errors.date = '日付は必須です';
      isValid = false;
    }
    if (!diary.content.trim()) {
      errors.content = '内容は必須です';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      const url = id ? `http://localhost:5000/api/diaries/${id}` : 'http://localhost:5000/api/diaries';
      const method = id ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diary),
      });
      if (!response.ok) {
        throw new Error('日記の保存に失敗しました');
      }
      const savedDiary = await response.json();
      
      if (newImage) {
        await uploadImage(savedDiary.id);
      }
      
      setSuccessMessage('日記が正常に保存されました');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const uploadImage = async (diaryId) => {
    if (!newImage) return;

    const formData = new FormData();
    formData.append('file', newImage);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `http://localhost:5000/api/diaries/${diaryId}/images`, true);
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = function() {
        if (xhr.status === 201) {
          const result = JSON.parse(xhr.responseText);
          setDiary(prev => ({
            ...prev,
            images: [...prev.images, result]
          }));
          setNewImage(null);
          setUploadProgress(0);
          setSuccessMessage('画像が正常にアップロードされました');
          setTimeout(() => setSuccessMessage(null), 2000);
        } else {
          throw new Error('画像のアップロードに失敗しました');
        }
      };

      xhr.onerror = function() {
        throw new Error('画像のアップロードに失敗しました');
      };

      xhr.send(formData);
    } catch (err) {
      setError(err.message);
      setUploadProgress(0);
    }
  };

  const removeImage = async (imageId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:5000/api/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('画像の削除に失敗しました');
      }

      setDiary(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      }));
      setSuccessMessage('画像が正常に削除されました');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p>処理中...</p>
      </div>
    );
  }

  return (
    <div className="diary-detail">
      <h2>{id ? (isEditing ? '日記を編集' : '日記の詳細') : '新しい日記'}</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">タイトル:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={diary.title}
            onChange={handleChange}
            required
            disabled={!isEditing && id}
          />
          {validationErrors.title && <span className="validation-error">{validationErrors.title}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="date">日付:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={diary.date}
            onChange={handleChange}
            required
            disabled={!isEditing && id}
          />
          {validationErrors.date && <span className="validation-error">{validationErrors.date}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="weather">天気:</label>
          <input
            type="text"
            id="weather"
            name="weather"
            value={diary.weather}
            onChange={handleChange}
            disabled={!isEditing && id}
          />
        </div>
        <div className="form-group">
          <label htmlFor="constellation">星座:</label>
          <input
            type="text"
            id="constellation"
            name="constellation"
            value={diary.constellation}
            onChange={handleChange}
            disabled={!isEditing && id}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">内容:</label>
          <textarea
            id="content"
            name="content"
            value={diary.content}
            onChange={handleChange}
            required
            disabled={!isEditing && id}
          />
          {validationErrors.content && <span className="validation-error">{validationErrors.content}</span>}
        </div>
        <div className="form-group">
          <h3>修行項目</h3>
          {diary.practiceItems.map((item, index) => (
            <div key={index} className="practice-item">
              <input
                type="text"
                value={item.title}
                onChange={(e) => handlePracticeItemChange(index, 'title', e.target.value)}
                placeholder="項目名"
                disabled={!isEditing && id}
              />
              <input
                type="text"
                value={item.description}
                onChange={(e) => handlePracticeItemChange(index, 'description', e.target.value)}
                placeholder="詳細"
                disabled={!isEditing && id}
              />
              {(isEditing || !id) && (
                <button type="button" onClick={() => removePracticeItem(index)} className="remove-button">削除</button>
              )}
            </div>
          ))}
          {(isEditing || !id) && (
            <button type="button" onClick={addPracticeItem} className="add-button">修行項目を追加</button>
          )}
        </div>
        <div className="form-group">
          <h3>画像</h3>
          <div className="image-gallery">
            {diary.images.map((image, index) => (
              <div key={index} className="image-item">
                <img src={`http://localhost:5000${image.image_path}`} alt={`日記画像 ${index + 1}`} />
                {(isEditing || !id) && (
                  <button type="button" onClick={() => removeImage(image.id)} className="remove-button">削除</button>
                )}
              </div>
            ))}
          </div>
          {(isEditing || !id) && (
            <div className="image-upload">
              <input type="file" onChange={handleImageChange} accept="image/*" />
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="progress-bar">
                  <div className="progress" style={{width: `${uploadProgress}%`}}></div>
                </div>
              )}
            </div>
          )}
        </div>
        {(isEditing || !id) && (
          <button type="submit" className="submit-button">保存</button>
        )}
        {id && !isEditing && (
          <button type="button" onClick={onEdit} className="edit-button">編集</button>
        )}
      </form>
      <button onClick={onClose} className="close-button">閉じる</button>
    </div>
  );
};

export default DiaryDetail;