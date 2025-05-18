import {useState, useEffect, useCallback, useRef} from 'react';
import BackgroundTimer from 'react-native-background-timer';

// TODO : CHANGE TIME TO 300;
const TIMER_DURATION = 3000;

const useTimer = (initialDuration = TIMER_DURATION) => {
  const [secondsLeft, setSecondsLeft] = useState(initialDuration);
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      BackgroundTimer.clearInterval(timerRef.current);
    }

    //@ts-ignore
    timerRef.current = BackgroundTimer.setInterval(() => {
      setSecondsLeft(prevSeconds => {
        if (prevSeconds <= 1) {
          // @ts-ignore
          BackgroundTimer.clearInterval(timerRef.current);
          timerRef.current = null; // 타이머 참조 초기화
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startTimer();

    return () => {
      if (timerRef.current) {
        BackgroundTimer.clearInterval(timerRef.current);
      }
    };
  }, [startTimer]);

  const resetTimer = useCallback(() => {
    setSecondsLeft(initialDuration); // 타이머 시간 초기화
    startTimer(); // 타이머 다시 시작
  }, [initialDuration, startTimer]);

  const formatTime = useCallback(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }, [secondsLeft]);

  return {
    secondsLeft,
    formatTime,
    resetTimer,
  };
};

export default useTimer;
