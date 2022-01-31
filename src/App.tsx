import type { Component } from "solid-js";
import { createEffect, For } from "solid-js";
import {
  createStore,
  SetStoreFunction,
  Store,
  DeepReadonly,
} from "solid-js/store";
import { styled } from "solid-styled-components";

import logo from "./logo.svg";
import styles from "./App.module.css";
import AffordanceUI from "./AffordanceUI.module.less";

function createLocalStore<T>(initState: T): [Store<T>, SetStoreFunction<T>] {
  const [state, setState] = createStore(initState);
  if (localStorage.todos) setState(JSON.parse(localStorage.todos));
  createEffect(() => (localStorage.todos = JSON.stringify(state)));
  return [state, setState];
}

class Interval {
  startTime: Date;
  stopTime: Date | null = null;

  constructor(startTime: Date, stopTime: Date | null = null) {
    this.startTime = startTime;
    this.stopTime = stopTime;
  }

  getDuration() {
    if (this.stopTime === null || this.startTime === null) return 0;
    return this.stopTime.getTime() - this.startTime.getTime();
  }
}

class TaskData {
  description: string;
  times: Interval[];

  constructor(message: string, startDate: Date) {
    this.description = message;
    this.times = [new Interval(startDate)];
  }

  start(): TaskData {
    return {
      ...this,
      times: [...this.times, new Interval(new Date())],
    };
  }
  stop(): TaskData {
    return {
      ...this,
      times: [
        ...this.times.slice(this.times.length - 1),
        new Interval(this.times.slice(-1)[0].startTime, new Date()),
      ],
    };
  }
  getTotalTimes() {
    return "1";
    return this.times.reduce((acc, t) => acc + t.getDuration(), 0);
  }
}

interface TaskProps {
  task: DeepReadonly<TaskData>;
  onChange: Function;
}

const Task = (props: TaskProps) => {
  return (
    <>
      <div class={`${AffordanceUI.inputContainer}`}>
        <input
          class={`${AffordanceUI.input}`}
          type="text"
          value={props.task.description}
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            props.onChange({
              ...props.task,
              description: target.value,
            });
          }}
        />
        <span>{props.task.times.length}</span>
        {props.task.times.slice(-1)[0].stopTime !== null ? (
          <button
            onClick={(_) => {
              return props.onChange(props.task.start());
            }}
          >
            Start
          </button>
        ) : (
          <button
            onClick={(_) => {
              return props.onChange(props.task.stop());
            }}
          >
            Stop
          </button>
        )}
      </div>
    </>
  );
};

const TaskList = () => {
  //let [state, setState] = createLocalStore({
  let [state, setState] = createStore({
    tasks: new Array<TaskData>(),
  });

  return (
    <div>
      <For each={state.tasks}>
        {(task, i) => {
          return (
            <Task
              task={task}
              onChange={(task: TaskData) => {
                setState("tasks", i(), task);
              }}
            ></Task>
          );
        }}
      </For>
      <button
        class={`${AffordanceUI.btn} ${AffordanceUI.primary} ${AffordanceUI.small}`}
        onClick={(_) => {
          setState({
            tasks: [...state.tasks, new TaskData("...", new Date())],
          });
        }}
      >
        Add
      </button>
    </div>
  );
};

const App: Component = () => {
  const a = new A();
  const Aa: Array<A> = [a];

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="it SPINS" />
        <For each={Aa}>
          {(a, i) => {
            return <B a={a} />;
          }}
        </For>
        <TaskList />
      </header>
    </div>
  );
};

// AAAAAAAAAAAAAAAAAAAAAAAAAAAAA
interface BProps {
  a: DeepReadonly<A>;
}
const B = (props: BProps) => {
  return <>{props.a.blep()}</>;
};

class A {
  public blep() {
    return "aeiou";
  }
}

export default App;
