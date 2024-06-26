import React, { useState, useEffect } from 'react';
import '../cssfile/tabbar.css'; // CSS 파일 import
import '../cssfile/modal.css'; // CSS 파일 import
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const TabBar = () => {
  let githubId = localStorage.getItem('githubId'); // Assuming userId is stored in localStorage

  const [badges, setBadges] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(()=>{
    githubId = localStorage.getItem('githubId');
  }, [])

  const handleMyProfileClick = () => {
    console.log(githubId)
    navigate(`/MyProfile/${githubId}?token=${githubId}`);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('githubId');
    navigate('/');
  };

  const openModal = async () => {
    try {
      const response = await axios.get(`http://43.202.195.98:8080/api/badge/myBadgeList/${githubId}`);
      setBadges(response.data.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  const handleDiaryClick = () => {
    if (githubId) {
      navigate(`/commitCheck/${githubId}`);
    } else {
      console.error('User ID not found in localStorage');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const GroupMain = () => {
    if (githubId) {
      navigate(`/GroupMain/${githubId}`);
    } else {
      console.error('User ID not found in localStorage');
    }
  };

  return (
    <div className="tab-bar">
      <div className="tab-group">
        <div className="tab-sec-1">
          <div className="web-name">Commit Farm</div>
        </div>
        <div className='tab-sec-2'>
          <div className="tab-item" onClick={handleDiaryClick}>Diary</div>
          <div className="tab-item" onClick={GroupMain}>Group</div>
          <div className="tab-item" onClick={openModal}>Badge</div>
          <div className="tab-item" onClick={handleMyProfileClick}>MyPage</div>
          <div className="logout-button">
            <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
          </div>
        </div>
      </div>
      
      {/* 모달 */}
      {isModalOpen && (
        <div className="modal-container">
          <div className="modal-background" onClick={closeModal}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">뱃지 목록</h2>
              <div className="modal-close" onClick={closeModal}>❌</div>
            </div>
            {/* 뱃지 내용 */}
            <div className="badge-list">
              {badges.map((badge) => (
                <div key={badge.badgeId} className="badge-item">
                  <img src={`/images/badge_${badge.badgeId}.png`} alt={badge.badgeName} className="badge-image" />
                  <div className="badge-description">{badge.description}</div>
                  <div>
                    <h3>{badge.badgeName}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabBar;
