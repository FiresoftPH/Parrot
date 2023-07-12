import styles from "./ChatUI.module.css";

import ChatIconNoBG from "src/assets/ChatIconNoBG.svg";
import RenameIcon from "src/assets/RenameIcon.svg";
import ClearChatHistoryIcon from "src/assets/ClearChatHistoryIcon.svg";
import ChatInputField from "../ChatInputField/ChatInputField";
import ChatScreenInitalized from "../ChatScreen/ChatScreenInitialized";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userSlice from "../../store/userSlice";

// const DUMMY_TEXT_DATA = [
//   {
//     assignmentId: "w1",
//     chatHistory: [
//       { chatId: 0, message: "Hello.", sender: "user" },
//       {
//         chatId: 1,
//         message: "Hi, any help u need with assignment 1?",
//         sender: "ai",
//         rating: "none",
//       },
//     ],
//   },
// ];

import DUMMY_TEXT_DATA from "./ChatData.json";
import BIG_DUMMY_DATA from "./BigData.json";
import ChatScreenNotInit from "../ChatScreen/ChatScreenNotInit";

let shouldUpdate = false;
const ChatUI = (props) => {
  // let chatName = props.mode;

  let chatName = useParams().assignmentId;
  const courseName = useParams().subjectId;
  // let chatName = "Calculus 1"

  // console.log(BIG_DUMMY_DATA.filter((sub) => {
  //     console.log(sub.course)
  //     console.log(courseName)

  //     return sub.course == courseName
  //   })[0].assignments)

  console.log(chatName);

  const [history, setHistory] = useState(
    BIG_DUMMY_DATA.filter((sub) => {
      return sub.course == courseName;
    })[0].assignments
  );

  const [topName, setTopName] = useState("-");

  const [lock, setLock] = useState(false)

  const askAIHandler = (question) => {
    if (topName !== "-") {
      // For any assignment chat

      console.log(question);

      setHistory((prevState) =>
        prevState.map((assignment) => {
          if (assignment.assignmentId === chatName) {
            return {
              ...assignment,
              chatHistory: [
                ...assignment["chatHistory"],
                {
                  chatId: Math.random(),
                  message: question,
                  sender: "user",
                },
              ],
            };
          } else {
            return assignment;
          }
        })
      );

      setHistory((prevState) =>
        prevState.map((assignment) => {
          if (assignment.assignmentId === chatName) {
            return {
              ...assignment,
              chatHistory: [
                ...assignment["chatHistory"],
                {
                  chatId: Math.random(),
                  message: "No. You can do it yourself.",
                  sender: "ai",
                  rating: "none",
                },
              ],
            };
          } else {
            return assignment;
          }
        })
      );
    } else {
      // For general chat

      setHistory((prevState) =>
        prevState.map((assignment) => {
          if (assignment.assignmentId === chatName) {
            return {
              ...assignment,
              chatHistory: [
                ...assignment["chatHistory"],
                {
                  chatId: Math.random(),
                  message: question,
                  sender: "user",
                },
              ],
            };
          } else {
            return assignment;
          }
        })
      );

      setHistory((prevState) =>
        prevState.map((assignment) => {
          if (assignment.assignmentId === chatName) {
            return {
              ...assignment,
              chatHistory: [
                ...assignment["chatHistory"],
                {
                  chatId: Math.random(),
                  message: "Which assignment is your question referencing",
                  sender: "ai",
                  rating: "none",
                  assignment: history.map((ass) => {
                    if (ass.name !== "General")
                      return { name: ass.name, id: ass.assignmentId };
                  }),
                },
              ],
            };
          } else {
            return assignment;
          }
        })
      );

      setLock(true)
    }
  };

  const ratingHandler = (rating, id) => {
    shouldUpdate = true;
    // console.log(rating, id)

    setHistory((prevState) =>
      prevState.map((assignment) => {
        if (assignment.assignmentId === chatName) {
          const ratedChat = assignment.chatHistory.map((chat) => {
            if (chat.sender === "ai" && chat.chatId === id) {
              return {
                ...chat,
                rating: rating,
              };
            } else {
              return chat;
            }
          });

          return {
            ...assignment,
            chatHistory: ratedChat,
          };
        } else {
          return assignment;
        }
      })
    );
  };

  useEffect(() => {
    if (chatName !== "General") {
      console.log("I run after");
      console.log(shouldUpdate);
      if (shouldUpdate === false) {
        const scrollBar = document.getElementById("chatScroll");
        scrollBar.scrollTop = scrollBar.scrollHeight;
        // console.log("Go to bottom")
      } else {
        shouldUpdate = false;
      }
      setTopName(
        history.filter((ass) => ass.assignmentId === chatName)[0].name
      );
    }
  }, [
    <ChatScreenInitalized
      onRate={ratingHandler}
      history={history.filter((ass) => ass.assignmentId === chatName)[0]}
    />,
  ]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.header}>
          <img src={ChatIconNoBG} />
          <p>{topName}</p>
          <img src={RenameIcon} />
          <img src={ClearChatHistoryIcon} />
          <div className={styles.sepLine} />
        </div>
        <div className={styles.chatting}></div>
        {/* {init ?  */}
        {chatName !== "General" ? (
          <ChatScreenInitalized
            onRate={ratingHandler}
            history={history.filter((ass) => ass.assignmentId === chatName)[0]}
            // assignment={init ? history.map((ass) => {}) : null}
          />
        ) : (
          <ChatScreenNotInit
            onRate={ratingHandler}
            history={history.filter((ass) => ass.assignmentId === chatName)[0]}
            onChose={() => { setLock(false) }}
          />
        )}
        {/* : <></>} */}
        <ChatInputField onSend={askAIHandler} lock={lock} />
      </div>
      {/* <div className={styles.temp}> */}
      <div className={styles.backdrops}>
        <div
          // style={{
          //   width: props.width,
          //   height: props.height,
          // }}
          className={styles.backdrop}
        >
          <div className={styles.yellowCircle} />
          <div className={styles.redCircle} />
        </div>
        <div
          // style={{
          //   width: props.width,
          //   height: props.height,
          // }}
          className={styles.backdrop1}
        />
      </div>
      {/* </div> */}
    </div>
  );
};

export default ChatUI;
