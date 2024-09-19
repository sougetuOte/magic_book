import React, { useState, useEffect } from 'react';

const DiaryList = ({ onDiarySelect, onCreateNew, onDiaryEdit }) => {
  const [diaries, setDiaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/diaries');
      if (!response.ok) {
        throw new Error(`HTTPエラー: ${response.status}`);
      }
      const data = await response.json();
      setDiaries(data);
      setError(null);
    } catch (err) {
      setError(`日記の取得に失敗しました: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiaryClick = (id) => {
    onDiarySelect(id);
  };

  const handleDiaryDoubleClick = (id) => {
    onDiaryEdit(id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  if (isLoading) return <div className="loading">読み込み中...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="diary-list">
      <h2>日記一覧</h2>
      <button onClick={onCreateNew} className="create-new-button">新規作成</button>
      {diaries.length === 0 ? (
        <p>日記がありません。新しい日記を作成してください。</p>
      ) : (
        <ul>
          {diaries.map((diary) => (
            <li 
              key={diary.id} 
              onClick={() => handleDiaryClick(diary.id)}
              onDoubleClick={() => handleDiaryDoubleClick(diary.id)}
              title="ダブルクリックで編集"
              className="diary-item"
            >
              <span className="diary-date">{formatDate(diary.date_time)}</span>
              <span className="diary-title">{diary.title}</span>
              <span className="diary-weather">{diary.weather}</span>
              <span className="diary-constellation">{diary.constellation}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DiaryList;