import React, { useState, useEffect } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import styles from "./Body.module.css";
import swal from "sweetalert";
let Body = () => {
  let [wikiSearchReturnValues, setWikiSearchReturnValues] = useState([]);
  let [loading, setLoading] = useState(false);
  let [askQuestion, setAskQuestion] = useState("");
  let [pause, setPause] = useState(false);
  let [answer, setAnswer] = useState(``);
  let [logoutShow, setLogoutShow] = useState(false);
  let [displayEmail, setDisplayEmail] = useState("");
  let [logoutCount, setLogoutCount] = useState(0);
  let [displayName, setDisplayName] = useState("");
  let [isSignup, setIsSignup] = useState(false);
  let [giveIntro, setGiveIntro] = useState(false);
  let [showIntro, setShowIntro] = useState(true);
  let [intro, setIntro] = useState(false);
  let [question, setQuestion] = useState("");
  let [dis, setDis] = useState(true);
  let [showlogin, setShowLogin] = useState(false);
  let [showsignup, setShowsignup] = useState(false);
  let [loginName, setLoginName] = useState("");
  let [loginEmail, setLoginEmail] = useState("");
  let [signupName, setsignupName] = useState("");
  let [signupEmail, setsignupEmail] = useState("");
  let [isLogin, setIsLogin] = useState(false);
  let count = logoutCount % 2 === 1;
  let showLogout = isLogin && count;
  let logoutHandler = () => {
    speak({ text: `Systems Off , Goodbye ${displayName}` });
    setIsLogin(false);
    setAskQuestion("");
    setShowLogin(false);
    setAnswer("");
  };
  let clearAnswerHandler = () => {
    setAnswer("");
    cancel();
    setGiveIntro(false);
    setDis("");
    setAskQuestion("");
  };
  let { speak, cancel } = useSpeechSynthesis();
  let LoginHandler = () => {
    setShowLogin(true);
    setShowsignup(false);
    if (isLogin) {
      setLogoutCount(logoutCount + 1);
    }
  };
  let SignupHandler = () => {
    setShowLogin(false);
    setShowsignup(true);
  };
  let giveIntroHandler = () => {
    let speakedText = `Hi, I'm John, a versatile bot ready to answer your general questions.
    With a vast knowledge base, I'm here to provide you information. Feel
    free to ask me unlimited questions by using the search box below and
    I'll provide prompt and helpful responses. But , I do have the limited Knowledge and sometimes I will be unable to give answer . How can I assist you today?`;
    setGiveIntro(true);
    setAnswer(speakedText);
    speak({ text: speakedText });
  };
  let handleInputChange = (e) => {
    let { value } = e.target;
    setQuestion(value);
    setAskQuestion(value);
    setDis(value.trim().length < 2);
  };
  let introHandler = () => {
    setIntro(true);
  };
  useEffect(() => {
    if (isLogin) {
      let timer = setTimeout(() => {
        setShowIntro(false);
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [isLogin]);
  let answerBox = (
    <div className={styles.answerBox}>
      {giveIntro ? <p className={styles.answer}>{answer}</p> : ""}
    </div>
  );
  let cancelHandler = () => {
    setShowsignup(false);
    setShowLogin(false);
  };
  let introBox = (
    <div className={styles.chatbox}>
      {!giveIntro ? (
        <p className={styles.introText}>Can I give my introduction ?</p>
      ) : (
        ""
      )}
      {!giveIntro ? (
        <button className={styles.yesButton} onClick={giveIntroHandler}>
          Yes
        </button>
      ) : (
        ""
      )}
      {!giveIntro ? (
        <button className={styles.noButton} onClick={introHandler}>
          No
        </button>
      ) : (
        ""
      )}
    </div>
  );
  useEffect(() => {
    if (isSignup) {
      setShowsignup(false);
      setShowLogin(true);
    }
  }, [isSignup]);
  let signupSubmitHandler = () => {
    let pattern = /^[a-zA-Z0-9]+([._][a-zA-Z0-9]+)*@gmail.com$/;
    if (signupName.length < 3) {
      swal("Invalid Name", "Name length cannot be less than 3", "error");
      return;
    }
    if(!pattern.test(signupEmail)){
      swal("Invalid Email","Email is not entered in correct format of gmail","error");
      return ;
    }
    if (signupEmail.length < 5 || !signupEmail.includes("@")) {
      swal(
        "Invalid Email",
        "Email must contain a proper address with a minimum length of 6",
        "error"
      );
      return;
    }
    fetch("https://bot-john-8d089-default-rtdb.firebaseio.com/signup.json")
      .then((res) => res.json())
      .then((data) => {
        let signupData = Object.values(data);
        let found = signupData.find(
          (obj) => obj.username === signupName && obj.email === signupEmail
        );
        if (found) {
          swal("Already Registered", "You are already registered", "warning");
          setShowsignup(false);
          setShowLogin(true);
          return;
        }
        fetch("https://bot-john-8d089-default-rtdb.firebaseio.com/signup.json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: signupName,
            email: signupEmail,
            date_DAY_MM_DD_YY: new Date().toDateString(),
            time_HH_MM_SS: new Date().toLocaleTimeString(),
          }),
        })
          .then((res) => res.json())
          .then(() => {
            swal(
              "Successful",
              "Your account has been created successfully",
              "success"
            );
            setIsSignup(true);
            setsignupEmail("");
            setsignupName("");
          });
      })
  };
  let sendHandler = () => {
    if (answer === "") {
      setLoading(true);
      setAnswer("Finding Results");
    };
    setWikiSearchReturnValues([]);
    setGiveIntro(true);
    if (askQuestion.includes("your capabilities")) {
      let speakText =
        "I am a general bot structure designed for giving output for general questions.";
      setAnswer(speakText);
      speak({ text: speakText });
      return;
    }
    if (askQuestion.includes("your creator")) {
      let speakText =
        "I am designed by a creator named Saksham Verma as a project in a span of 3 days. His mail id is sakshamverma799@gmail.com.";
      setAnswer(speakText);
      speak({ text: speakText });
      return;
    }
    let url = "https://en.wikipedia.org/w/api.php";
    let params = {
      action: "query",
      list: "search",
      srsearch: askQuestion,
      format: "json",
    };
    let letructedUrl = url + "?origin=*";
    Object.keys(params).forEach((key) => {
      letructedUrl += "&" + key + "=" + params[key];
    });
    fetch(letructedUrl)
      .then((response) => response.json())
      .then((response) => {
        let searchResults = [];
        for (let key in response.query.search) {
          searchResults.push({
            queryResultPageFullURL: "no link",
            queryResultPageID: response.query.search[key].pageid,
            queryResultPageTitle: response.query.search[key].title,
            queryResultPageSnippet: response.query.search[key].snippet,
          });
        }
        setWikiSearchReturnValues(searchResults);
        fetchPageURLs(searchResults);
        return new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });
      })
      .then(() => {
        if (pause) {
          if (answer) {
            fetch(
              "https://bot-john-8d089-default-rtdb.firebaseio.com/qna.json",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ask_by_whom: displayName,
                  his_or_her_email_id: displayEmail,
                  asked_question: askQuestion,
                  answer_provided: answer,
                }),
              }
            ).then((res) => res.json());
          } else {
            let notAnsweredText =
              "Sorry , But I am unable to find the answer because of limited access over data . But , I will try to extend my data access control in future . For now , I feel sorry to not to provide any relatable answer for your question.";
            fetch(
              "https://bot-john-8d089-default-rtdb.firebaseio.com/qna.json",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ask_by_whom: displayName,
                  his_or_her_email_id: displayEmail,
                  asked_question: askQuestion,
                  answer_provided: notAnsweredText,
                }),
              }
            ).then((res) => res.json());
            setAnswer(
              "Sorry , But I am unable to find the answer because of limited access over data . But , I will try to extend my data access control in future . For now , I feel sorry to not to provide any relatable answer for your question."
            );
            speak({ text: notAnsweredText });
          }
        }
      });
  };
  let fetchPageURLs = (searchResults) => {
    for (let key in searchResults) {
      let page = searchResults[key];
      let pageID = page.queryResultPageID;
      let urlForRetrievingPageURLByPageID = `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=extracts&pageids=${pageID}&exsentences=5&explaintext&format=json`;
      fetch(urlForRetrievingPageURLByPageID)
        .then((response) => response.json())
        .then((response) => {
          let extract = response.query.pages[pageID].extract;
          page.queryResultPageFullURL = response.query.pages[pageID].fullurl;
          page.queryResultPageSnippet = extract;
          setWikiSearchReturnValues((prevSearchResults) => [
            ...prevSearchResults,
          ]);
          if (key === "0") {
            let sentences = extract.split(".").slice(0, 5).join(".") + ".";
            setTimeout(() => {
              setAnswer(sentences);
              setPause(false);
              speak({ text: sentences });
            }, 1000);
            let intervalId = setInterval(() => {
              setAnswer((prevAnswer) => {
                if (prevAnswer !== "" && prevAnswer !== "Finding Results") {
                  fetch(
                    "https://bot-john-8d089-default-rtdb.firebaseio.com/qna.json",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        ask_by_whom: displayName,
                        his_or_her_email_id: displayEmail,
                        asked_question: askQuestion,
                        answer_provided: prevAnswer,
                        date_DAY_MM_DD_YY: new Date().toDateString(),
                        time_HH_MM_SS: new Date().toLocaleTimeString(),
                      }),
                    }
                  ).then((res) => res.json());
                } else {
                  if (prevAnswer === "") {
                    setAnswer(
                      "Sorry , But I am unable to find the answer because of limited access over data . But , I will try to extend my data access control in future . For now , I feel sorry to not to provide any relatable answer for your question."
                    );
                    fetch(
                      "https://bot-john-8d089-default-rtdb.firebaseio.com/qna.json",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          ask_by_whom: displayName,
                          his_or_her_email_id: displayEmail,
                          asked_question: askQuestion,
                          answer_provided: answer,
                          date_DAY_MM_DD_YY: new Date().toDateString(),
                          time_HH_MM_SS: new Date().toLocaleTimeString(),
                        }),
                      }
                    ).then((res) => res.json());
                  }
                }
                return sentences;
              });
            }, 1000);
            setTimeout(() => {
              clearInterval(intervalId);
            }, 1000);
          }
        });
    }
  };
  let loginSubmitHandler = () => {
    if (loginName === "admin" && loginEmail === "admin@gmail.com") {
      navigate("/admin");
      return;
    }
    if (loginName.length < 3) {
      swal("Invalid Name", "Name length cannot be less than 3", "error");
      return;
    }
    if (loginEmail.length < 5 || !loginEmail.includes("@")) {
      swal(
        "Invalid Email",
        "Email must contain a proper address with a minimum length of 6",
        "error"
      );
      return;
    }
    fetch(
      `https://bot-john-8d089-default-rtdb.firebaseio.com/signup.json?orderBy="email"&equalTo="${loginEmail}"`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data !== null) {
          let users = Object.values(data);
          let matchedUser = users.find((user) => user.username === loginName);
          if (matchedUser) {
            fetch(
              "https://bot-john-8d089-default-rtdb.firebaseio.com/login.json",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: loginName,
                  email: loginEmail,
                  date_DAY_MM_DD_YY: new Date().toDateString(),
                  time_HH_MM_SS: new Date().toLocaleTimeString(),
                }),
              }
            )
              .then(() => {
                swal(
                  "Login Successful",
                  "You have successfully logged in",
                  "success"
                );
                speak({ text: `Systems On , Hello ${loginName}` });
                setDisplayName(loginName);
                setDisplayEmail(loginEmail);
                setGiveIntro(false);
                setLoginEmail("");
                setLoginName("");
                setShowLogin(false);
                setIsLogin(true);
              })
              .catch((error) => {
                swal("Login Error", "Failed to post login data", "error");
              });
          } else {
            swal("Incorrect Details", "Invalid name or email", "error");
          }
        } else {
          swal("User Not Found", "Please sign up before logging in", "warning");
        }
      });
    setLogoutShow(false);
  };
  let loginDiv = (
    <div className={styles.loginDiv}>
      <div className={styles.loginHeadingDiv}>
        <h3 className={styles.loginHeading}>Login</h3>
        <p className={styles.cancel} onClick={cancelHandler}>
          X
        </p>
      </div>
      <div className={styles.loginNameDiv}>
        <label className={styles.loginUsername}>Name</label>
        <input
          type="text"
          placeholder="Full Name ..."
          className={styles.loginInputName}
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
        />
      </div>
      <div className={styles.loginEmailDiv}>
        <label className={styles.loginEmail}>Email</label>
        <input
          className={styles.loginInputEmail}
          type="email"
          placeholder="Enter Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />
      </div>
      <button className={styles.createLoginButton} onClick={loginSubmitHandler}>
        Login
      </button>
      <div className={styles.dontDiv}>
        <p className={styles.dontLogin}>
          Don't have an account ?{" "}
          <button className={styles.createLogin} onClick={SignupHandler}>
            Create Now
          </button>
        </p>
      </div>
    </div>
  );
  let signupDiv = (
    <div className={styles.signupDiv}>
      <div className={styles.signupHeadingDiv}>
        <h3 className={styles.signupHeading}>Sign Up</h3>
        <p className={styles.cancel} onClick={cancelHandler}>
          X
        </p>
      </div>
      <div className={styles.signupNameDiv}>
        <label className={styles.signupUsername}>Name</label>
        <input
          type="text"
          placeholder="Full Name ..."
          className={styles.signupInputName}
          value={signupName}
          onChange={(e) => setsignupName(e.target.value)}
        />
      </div>
      <div className={styles.signupEmailDiv}>
        <label className={styles.signupEmail}>Email</label>
        <input
          className={styles.signupInputEmail}
          type="email"
          placeholder="Enter Email"
          value={signupEmail}
          onChange={(e) => setsignupEmail(e.target.value)}
        />
      </div>
      <button
        className={styles.createSignupButton}
        onClick={signupSubmitHandler}
      >
        Create
      </button>
      <div className={styles.dontSignupDiv}>
        <p className={styles.dontSign}>Already a user ? </p>
        <button className={styles.createSignup} onClick={LoginHandler}>
          Login
        </button>
      </div>
    </div>
  );
  return (
    <div className={styles.main}>
      <div className={styles.structureContainer}>
        <div className={isLogin ? styles.parentDiv : styles.notParentDiv}>
          {showlogin && !isLogin ? loginDiv : ""}
          {showsignup ? signupDiv : ""}
          <div className={isLogin ? styles.upperBody : styles.notUpperBody}>
            <div className={styles.flexDiv}>
              <div className={styles.earSide1}></div>
              <div className={styles.firstSensor}></div>
              <div className={styles.head}>
                <div className={styles.headCircle}></div>
                <div className={styles.face}>
                  <div className={isLogin ? styles.eyesDiv : styles.notEyesDiv}>
                    <div className={styles.firstEye}></div>
                    <div className={styles.secondEye}></div>
                  </div>
                  <div
                    className={isLogin ? styles.mouth : styles.notMouth}
                  ></div>
                </div>
              </div>
              <div className={styles.secondSensor}></div>
              <div className={styles.earSide2}></div>
            </div>
            {showIntro && !giveIntro && !intro && isLogin ? introBox : ""}
          </div>
          <div className={isLogin ? styles.lowerBody : styles.notLowerBody}>
            <div className={styles.flexDiv}>
              <div className={styles.firstHand}></div>
              <div className={styles.chest}></div>
              <div className={styles.secondHand}></div>
            </div>
          </div>
        </div>
        <div className={isLogin ? styles.shadowDiv : styles.notShadowDiv}></div>
      </div>
      {giveIntro && isLogin ? answerBox : ""}
      <div className={styles.inputDiv}>
        {showLogout ? (
          <div className={styles.logoutDiv}>
            <button className={styles.logoutButton} onClick={logoutHandler}>
              Logout
            </button>
          </div>
        ) : (
          ""
        )}
        <button className={styles.loginButton} onClick={LoginHandler}>
          {isLogin ? displayName : "Log in"}
        </button>
        <input
          type="text"
          placeholder={
            !isLogin
              ? "You need to login first to use this chat box"
              : "Ask anything relatable"
          }
          className={styles.inputBox}
          value={askQuestion}
          onChange={handleInputChange}
          disabled={!isLogin}
        />
        <button
          className={styles.submit}
          disabled={askQuestion.trim().length < 2}
          onClick={sendHandler}
        >
          Send
        </button>
        {isLogin && giveIntro ? (
          <button
            className={styles.clearButton}
            disabled={answer === ""}
            onClick={clearAnswerHandler}
          >
            Clear Answer
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default Body;