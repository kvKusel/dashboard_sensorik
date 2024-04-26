import React from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';

const JoyrideOnboarding = ({ run, setRun, steps }) => {
  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setRun(false);
    }
  };

  return (
    <Joyride
      continuous
      run={run}
      steps={steps}
      callback={handleJoyrideCallback}
      showSkipButton
      styles={{
        options: {
          zIndex: 10000,
        },
      }}
    />
  );
};

export default JoyrideOnboarding;
