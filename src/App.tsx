import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import './App.scss'
import 'bulma/bulma.sass';
import { generateExpression } from './services/generateExpression';
import { getTimerString } from './services/getTimerString';
import { useLocalStorage } from './services/useLocalStorage';

const successSound = new Audio('success.mp3');
const errorSound = new Audio('error.mp3');
const challengeEndSound = new Audio('challenge_end.mp3');
const challengeStartSound = new Audio('challenge_start.mp3');
challengeEndSound.volume = 0.2;

export const App: React.FC = () => {
  const [isInputEmptyError, setIsInputEmptyError] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [challengeTimer, setChallengeTimer] = useState(0);
  const [level, setLevel] = useLocalStorage<Levels>('level', 1);
  const [timerVisible, setTimerVisible] = useLocalStorage<boolean>('timerVisible', true);
  const [volumeApplied, setVolumeApplied] = useLocalStorage<boolean>('volumeApplied', true);
  const [totalScore, setTotalScore] = useLocalStorage<number>('totalScore', 0);
  const [challengeScore, setChellangeScore] = useState<ChallengeScore>({ correctScore: 0, incorrectScore: 0 });
  const [challengeRecord, setChellangeRecord] = useLocalStorage<number>('challengeRecord', 0);
  const [operationsList, setOperationsList] = useLocalStorage<OperationsActive>('operationsList', {
    add: true,
    subtract: true,
    multiply: true,
    divide: true,
  });
  const [expression, setExpression] = useState<Expression>(generateExpression(operationsList, level));
  const [animation, setAnimation] = useState(false);

  const input = useRef<HTMLInputElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const message = useRef<HTMLDivElement>(null);
  const check = useRef<HTMLElement>(null);

  const onKeyPressed = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (input.current?.value === '') {
        setIsInputEmptyError(true);
        return;
      }
      if (input.current?.value === expression.result.toString()) {
        setTotalScore(totalScore + 1);

        if (challengeTimer) {
          if (challengeScore.correctScore + 1 > challengeRecord) {
            setChellangeRecord(challengeScore.correctScore + 1);
          }
          setChellangeScore(challengeScore => ({
            ...challengeScore,
            correctScore: challengeScore.correctScore + 1,
          }))

        }

        setAnimation(true);
        window.setTimeout(() => {
          setAnimation(false);
        }, 500);

        if (volumeApplied) {
          successSound.play();
        }
      } else {

        if (challengeTimer) {
          setChellangeScore(challengeScore => ({
            ...challengeScore,
            incorrectScore: challengeScore.incorrectScore + 1,
          }))
        }

        if (volumeApplied) {
          errorSound.play();
        }
      }
      if (challengeTimer) {
        setExpression(generateExpression());
      } else {
        setExpression(generateExpression(operationsList, level));
      }
      setInputValue('');
    }
  }, [volumeApplied, expression, operationsList, level, challengeTimer, challengeRecord,
    challengeScore, setChellangeRecord, setTotalScore, totalScore]);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsInputEmptyError(false);

    if (/^\d+$/.test(event.currentTarget.value) || event.currentTarget.value === '') {
      setInputValue(event.currentTarget.value)
    }
  };

  const operationButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    input.current?.focus();

    if (!(event.currentTarget.name in operationsList)) {
      return;
    }

    const key = event.currentTarget.name as keyof OperationsActive;

    let allOperationsOff = true;

    for (const operation in operationsList) {
      if (operationsList[operation as keyof OperationsActive] && operation !== key) {
        allOperationsOff = false;
      }
    }

    if (allOperationsOff) {
      return;
    }

    if (!challengeTimer) {
      setExpression(generateExpression(
        {
          ...operationsList,
          [key]: !operationsList[key],
        },
        level,
      ));
    }

    setOperationsList({
      ...operationsList,
      [key]: !operationsList[key],
    });
  };

  const levelsButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    input.current?.focus();

    try {
      const level: Levels = +event.currentTarget.name as Levels;
      
      if (!challengeTimer) {
        setExpression(generateExpression(operationsList, level));
      }

      setLevel(level);
    } catch (e) {
      console.error('Wrong level');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyPressed);

    return () => document.removeEventListener('keydown', onKeyPressed);
  }, [onKeyPressed]);

  const challengeButtonPressHandler = useCallback((sec: number) => {
    let timerId: number;
    let timeoutId: number;

    return function timerManage(
      timer: number,
      volumeState: boolean,
    ) {
      message.current?.classList.add('hidden');

      if (timer) {
        window.clearInterval(timerId);
        window.clearTimeout(timeoutId);
        if (volumeState) {
          challengeEndSound.play();
        }
        setChallengeTimer(0);
        setExpression(generateExpression(operationsList, level));
        message.current?.classList.remove('hidden');
      } else {
        if (volumeState) {
          challengeStartSound.play();
        }
        setChellangeScore({ correctScore: 0, incorrectScore: 0 })
        setExpression(generateExpression());
        setChallengeTimer(sec);

        input.current?.focus();

        timerId = window.setInterval(() => {
          setChallengeTimer(oldTimer => oldTimer - 1);
        }, 1000);

        timeoutId = window.setTimeout(() => {
          window.clearInterval(timerId);
          if (volumeState) {
            challengeEndSound.play();
          }
          message.current?.classList.remove('hidden');
        }, sec * 1000)
      }
    }
  }, []);

  const challengeButtonPressed = useCallback(challengeButtonPressHandler(300), []);

  return (
    <div className='main'>
      <div className='header'>
        <p className="header__title">
          TIME TO COUNT
        </p>
      </div>
      {challengeTimer !== 0 && (
        <div className="main__timer">
          <p className='main__timer-score'>{`Вирішено: ${challengeScore.correctScore}`}</p>
          {timerVisible && <p className='main__timer-time'>{getTimerString(challengeTimer)}</p>}
        </div>
      )}
      <div className="main__topInfo">
        <div className="main__controls">
          <button
            ref={button}
            className='main__controls-button'
            onClick={() => challengeButtonPressed(
              challengeTimer,
              volumeApplied,
            )}
          >
            {challengeTimer === 0 ? 'Start Challenge' : 'Stop Challenge'}
          </button>
          <div className="main__icons box">
            <span className="icon">
              <i
                className={cn('fa-solid', 'fa-xl', {
                  'fa-volume-xmark': !volumeApplied,
                  'fa-volume-high': volumeApplied
                })}
                style={{ color: '#1957c2' }}
                onClick={() => setVolumeApplied(!volumeApplied)}
              ></i>
            </span>
            <span className="icon">
              <i
                className={cn('fa-clock', 'fa-xl', {
                  'fa-regular': !timerVisible,
                  'fa-solid': timerVisible,
                })}
                style={{ color: '#1957c2' }}
                onClick={() => setTimerVisible(!timerVisible)}
              ></i>
            </span>
          </div>
        </div>
        <p className='main__topInfo-paragraph'>{`Усього вирішено: ${totalScore}`}</p>
        <p className='main__topInfo-paragraph'>{`Challenge-рекорд: ${challengeRecord}`}</p>
      </div>
      <div
        ref={message}
        className="main__challenge-results notification is-link hidden"
      >
        <button
          className="delete"
          onClick={() => message.current?.classList.add('hidden')}
        ></button>
        {`Правильних відповідей: ${challengeScore.correctScore}`}
        <br />
        {`Неправильних відповідей: ${challengeScore.incorrectScore}`}
        <br />
        <strong>{(challengeScore.correctScore >= challengeRecord) && 'Це рекорд!'}</strong>
      </div>
      <div className='main__container'>
        <div className="main__levels box">
          <p className='main__levels-label'>Рівень<br />складності</p>
          <button
            name='1'
            className={cn('main__operations-button', 'button', { 'is-info': level === 1 && challengeTimer === 0 })}
            onClick={levelsButtonClick}
          >
            1
          </button>
          <button
            name='2'
            className={cn('main__operations-button', 'button', { 'is-info': level === 2 && challengeTimer === 0 })}
            onClick={levelsButtonClick}
          >
            2
          </button>
          <button
            name='3'
            className={cn('main__operations-button', 'button', { 'is-info': level === 3 || challengeTimer !== 0 })}
            onClick={levelsButtonClick}
          >
            3
          </button>
          <button
            name='4'
            className={cn('main__operations-button', 'button', { 'is-info': level === 4 && challengeTimer === 0 })}
            onClick={levelsButtonClick}
          >
            4
          </button>
        </div>

        <div className="main__task box">
          <p className="main__task__expression">
            {expression.firstOperand + ' ' + expression.operation + ' ' + expression.secondOperand + ' ' + '='}
          </p>
          <input
            autoFocus
            ref={input}
            value={inputValue}
            type="text"
            className={cn('main__task__input', { 'main__task__input--error': isInputEmptyError })}
            onChange={onInputChange}
          />
        </div>

        <i
          ref={check}
          className={cn('main__correctIcon', 'fa-regular', 'fa-circle-check', 'fa-2xl', {
            'shown': animation,
          })}
          style={{ color: '#00c92c' }}
        ></i>

        <div className="main__operations box">
          <p className='main__operations-label'>Активні<br />дії</p>
          <button
            name='add'
            className={cn('main__operations-button', 'button', { 'is-info': operationsList.add || challengeTimer !== 0 })}
            onClick={operationButtonClick}
          >
            +
          </button>
          <button
            name='subtract'
            className={cn('main__operations-button', 'button', { 'is-info': operationsList.subtract || challengeTimer !== 0 })}
            onClick={operationButtonClick}
          >
            -
          </button>
          <button
            name='multiply'
            className={cn(
              'main__operations-button',
              'main__operations-button--multiply',
              'button',
              { 'is-info': operationsList.multiply || challengeTimer !== 0 }
            )}
            onClick={operationButtonClick}
          >
            *
          </button>
          <button
            name='divide'
            className={cn('main__operations-button', 'button', { 'is-info': operationsList.divide || challengeTimer !== 0 })}
            onClick={operationButtonClick}
          >
            :
          </button>
        </div>
      </div>

      <div className='main__info'>
        <p className="main__info-paragraph">
          Натисни Enter щоб підтвердити відповідь
        </p>
        <p className="main__info-paragraph">
          Натисни 'Start Challange' щоб розпочати челлендж (працює на 3 рівні складності та із усіма діями)
        </p>
        <p className="main__info-paragraph">
          Іконки в правому куті дозволяють вимкнути звуки та відображення таймеру у челледжі
        </p>
      </div>
    </div>
  )
};
