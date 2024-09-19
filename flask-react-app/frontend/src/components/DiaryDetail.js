import React, { useState, useEffect } from 'react';

const DiaryDetail = ({ id, onClose, isEditing, onEdit }) => {
  const [diary, setDiary] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    weather: '',
    constellation: '',
    content: '',
    practiceItems: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

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
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="loading">読み込み中...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="diary-detail">
      <h2>{id ? (isEditing ? '日記を編集' : '日記の詳細') : '新しい日記'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
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
        <div>
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
        <div>
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
        <div>
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
        <div>
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
        <div>
          <h3>修行項目</h3>
          {diary.practiceItems.map((item, index) => (
            <div key={index}>
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
                <button type="button" onClick={() => removePracticeItem(index)}>削除</button>
              )}
            </div>
          ))}
          {(isEditing || !id) && (
            <button type="button" onClick={addPracticeItem}>修行項目を追加</button>
          )}
        </div>
        {(isEditing || !id) && (
          <button type="submit">保存</button>
        )}
        {id && !isEditing && (
          <button type="button" onClick={onEdit}>編集</button>
        )}
      </form>
      <button onClick={onClose}>閉じる</button>
    </div>
  );
};

export default DiaryDetail;