/* eslint-disable @typescript-eslint/no-unused-vars */
import Button from 'components/atoms/Button';
import Typography from 'components/atoms/Typography';
import React, { useState } from 'react';

interface Example1Props {
  children?: React.ReactNode;
}

const Example1: React.FC<Example1Props> = ({ children }) => {
  console.log("🚀 ~ Example1:")

  return (
    <div>{children}</div>
  );
}

interface Example2Props {
  children?: React.ReactNode;
}

const Example2: React.FC<Example2Props> = ({ children }) => {
  console.log("🚀 ~ Example2:")

  return (
    <div>{children}</div>
  );
}

interface Example3Props {
  children?: React.ReactNode;
}

const Example3: React.FC<Example3Props> = ({ children }) => {
  console.log("🚀 ~ Example3:")

  return (
    <div>{children}</div>
  );
}

const PreviewNewFeature: React.FC = () => {
  const [count, setCount] = useState(0)
  return (
    <div className="p-demo">
      <div className="p-demo_actions">
        <Button onClick={() => {
          setCount((prev) => prev + 1)
        }}>
          <Typography content='+ 1' />
        </Button>
        <Button onClick={() => {
          setCount((prev) => prev - 1)
        }}>
          <Typography content='- 1' />
        </Button>
      </div>
      <div className="p-demo_result">
        <Typography content={count.toString()} />
      </div>
      <Example1 />
      <Example2 >
        <Example3 />
      </Example2>
    </div>
  );
}

export default PreviewNewFeature;
