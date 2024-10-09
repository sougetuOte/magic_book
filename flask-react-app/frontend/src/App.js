import React, { useState, useCallback } from 'react';
import DiaryList from './components/DiaryList';
import DiaryDetail from './components/DiaryDetail';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [selectedDiaryId, setSelectedDiaryId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleDiarySelect = (id) => {
    setSelectedDiaryId(id);
    setIsEditing(false);
  };

  const handleDiaryClose = useCallback(() => {
    setSelectedDiaryId(null);
    setIsCreating(false);
    setIsEditing(false);
    setRefreshList(prev => !prev); // リストを更新するためのトリガー
  }, []);

  const handleCreateNew = () => {
    setSelectedDiaryId(null);
    setIsCreating(true);
  };

  const handleEditDiary = (id) => {
    setSelectedDiaryId(id);
    setIsEditing(true);
  };

  const handleHomeClick = () => {
    setSelectedDiaryId(null);
    setIsCreating(false);
    setIsEditing(false);
  };

  return (
    <div className="App">
      <Header onHomeClick={handleHomeClick} onNewDiaryClick={handleCreateNew} />
      <main>
        {isCreating ? (
          <DiaryDetail onClose={handleDiaryClose} />
        ) : selectedDiaryId ? (
          <DiaryDetail 
            id={selectedDiaryId} 
            onClose={handleDiaryClose}
            isEditing={isEditing}
            onEdit={() => handleEditDiary(selectedDiaryId)}
          />
        ) : (
          <DiaryList 
            onDiarySelect={handleDiarySelect} 
            onCreateNew={handleCreateNew}
            onDiaryEdit={handleEditDiary}
            refreshTrigger={refreshList}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;