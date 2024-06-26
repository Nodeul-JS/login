import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../cssfile/GptPage.css';
import TabBar from '../Components/TabBar';
import Myprofilecap from '../Components/Myprofilecap';

const GptPage = () => {
  const { githubId } = useParams();
  const [feedback, setFeedback] = useState('');
  const [title, setTitle] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [profileKey, setProfileKey] = useState(Date.now());

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://43.202.195.98:8080/api/user/mypage/${githubId}`);
        setUserInfo(response.data.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [githubId]);

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`http://43.202.195.98:8080/api/commit/todayCommit/${githubId}`);
      const { description, title, createdAt } = response.data;
      setFeedback(description);
      setTitle(title);
      setCreatedAt(new Date(createdAt).toLocaleDateString());
      // 새로 고침을 트리거하기 위해 profileKey를 업데이트합니다.
      setProfileKey(Date.now());
    } catch (error) {
      console.error('Error fetching GPT feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gpt-container">
      <TabBar />
      <div className="gpt-main">
        <div className="gpt-ch1">
          <div className='gpt-feedback-section'>
            <h1>Get GPT Feedback</h1>
            <p>내 코드를 GPT에게 자동으로 요약해 보세요</p>
            <div>
              <button type="button" className="submit-button" onClick={handleButtonClick}>Submit</button>
            </div>
            <div className="gpt-feedback-container">
              <h2>GPT auto feedback</h2>
              {loading ? (
                <div className="loading-spinner">Loading...</div>
              ) : (
                <>
                  <textarea
                    value={feedback}
                    readOnly
                    className="gpt-feedback-textarea"
                  />
                  {title && <h3>한줄 요약 : {title}</h3>}
                  {createdAt && <p>{createdAt}</p>}
                </>
              )}
            </div>
          </div>
        </div>
        <div className='gpt-ch1'>
          <div className='gpt-2'>
              <div className='sec-1'>
                <Myprofilecap key={profileKey} />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GptPage;
