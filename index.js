const puppeteer = require('puppeteer');
const { defaultPath } = require('tough-cookie');

// enter in church signin details:
const email = "kacherpearce@gmail.com";
const password = "209kpkp281";

(async () => {

  const browser = await puppeteer.launch({
    headless: false, // Run in non-headless mode (visible browser window for debugging)
  });

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  // Navigate to https://silearn.churchofjesuschrist.org/
  await page.goto('https://silearn.churchofjesuschrist.org/');

  // Check if the current URL is "https://id.churchofjesuschrist.org/"
  const currentURL = await page.url();
  if (currentURL === 'https://id.churchofjesuschrist.org/') {
    console.log('Yes');

    // Enter text into the input box with id "okta-signin-username"
    await page.type('#okta-signin-username', email);

    // Click the submit button with id "okta-signin-submit"
    await page.click('#okta-signin-submit');

    // Wait for the next page to load
    await page.waitForNavigation();

    // Enter text into the password input box with id "input73"
    await page.type('#input73', password);

    // Click the submit button with class "button button-primary" and value "Verify"
    await page.click('input.button.button-primary[value="Verify"]');

    await page.waitForFunction(() => {
      return window.location.href === 'https://silearn.churchofjesuschrist.org/';
    });
    console.log("test-1")
    page.goto('https://silearn.churchofjesuschrist.org/courses/87087/modules');

    console.log("test0")


    await page.waitForSelector('.due_date_display');
    console.log('929');

    const matchingDueDateElement = await page.evaluate(async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          var currentDate = new Date();
          const options = { month: 'short', day: 'numeric' };
          currentDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);
          console.log("y");
          console.log("d", currentDate);
          currentDate = "Sep 29"; // delelte this
          const dueDateElements = document.querySelectorAll('.due_date_display');
          console.log('test111', dueDateElements);

          for (const element of dueDateElements) {
            if (element.innerText.replace(/(\r\n|\n|\r)/gm, "") === currentDate) {
              console.log(currentDate);
              //alert(element.parentNode.parentNode.querySelector(".module-item-title").firstElementChild.firstElementChild.classList.id = "currentLesson_hack2349")
              element.parentNode.parentNode.querySelector(".module-item-title").firstElementChild.firstElementChild.id = "currentLesson_hack2349";
              const siblingTitleElement = "currentLesson_hack2349";
              console.log('final', siblingTitleElement);
              resolve(siblingTitleElement);
              return;
            }
            console.log('v', element.innerText.replace(/(\r\n|\n|\r)/gm, ""));
          }

          resolve(null);
        }, 3100);
      });
    });
    async function waitForURLContaining(page, text) {
      return new Promise((resolve) => {
        const checkUrl = () => {
          if (page.url().includes(text)) {
            resolve();
          } else {
            setTimeout(checkUrl, 100); // Check again after 100ms
          }
        };
        checkUrl(); // Initial call to start checking
      });
    }
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    console.log("check", matchingDueDateElement);
    await page.waitForSelector('.due_date_display');
    if (matchingDueDateElement) {
      console.log(matchingDueDateElement);
      await page.waitForSelector('#currentLesson_hack2349');
      console.log("92378")
      page.$eval(`#currentLesson_hack2349`, element =>
        element.click()
      );
      console.log("222")
    }
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    await waitForURLContaining(page, "module_item_id");
    delay(800);
    try {
      var lessonType = await page.$("h1.title") || await page.$("h1#quiz_title") || await page.$("h1.discussion-title");
      lessonType = await page.evaluate(el => el.classList.toString(), lessonType);
    } catch {
      console.log("waiting..")
      delay(2200);

      var lessonType = await page.$("h1.title") || await page.$("h1#quiz_title") || await page.$("h1.discussion-title");
      lessonType = await page.evaluate(el => el.classList.toString(), lessonType);

    }
    lessonType = lessonType ? (lessonType.includes("discussion") ? "discussion" : "assignment") : "quiz"
    console.log(lessonType);

    if (lessonType === "discussion") {
      await page.waitForSelector(".discussion-reply-action");
      delay(1200)
      var prompt = await page.evaluate(() => {
        var title = document.querySelector("h1.discussion-title").innerText;
        //  if(title.includes("Class Community"))
        var subtitle = document.querySelector("h3") ? document.querySelector("h3").innerText.includes("Hello,") ? "" : document.querySelector("h3").innerText : ""
        var data = "";
        [...document.querySelectorAll("p"),
        discussion_topic.querySelectorAll("li")[discussion_topic.querySelectorAll("li").length - 1]
        ].map((e) => {
          if (e.closest("#discussion_topic") && !e.classList.contains("action")) {
            data += (e.tagName === "LI") ? e.innerHTML : e.innerText;
          }
        });
        var info = data;
        var example = document.querySelector(".discussion_entry.read-onload").querySelector(".discussion-section.message_wrapper ").innerText

        var prompt = `respond/complete this prompt below. respond with a very short simple 2-3 sentence reply at the level of a 9th grader. i have also given an example response at the bottom. only use that example for reference.  \n\n ${title + subtitle}\n ${info} \n\n example: \n\n ${example}`;
        console.log(prompt)
        return prompt;
      });
    } else if (lessonType === "quiz") {

      try {
        await page.waitForSelector('#take_quiz_link', { visible: true, timeout: 5000 }); // Set a timeout (e.g., 5 seconds)
    //    await page.click('#take_quiz_link');

        await page.evaluate(() => {
          const btn = document.querySelector('#take_quiz_link');
          if (btn) {
            btn.click();
          }
        });
      } catch {
        console.log("9")
        await page.waitForSelector('a.btn.btn-primary', { visible: true });
        console.log("8")

        await page.evaluate(() => {
          const btn = document.querySelector('a.btn.btn-primary');
          if (btn) {
            btn.click();
          }
        });

     //   await page.click('a.btn.btn-primary');
      }
      var prompt = await page.evaluate(() => {
        var prompt = {};
        var data = document.querySelector("header.quiz-header").innerText;
        document.querySelectorAll(".display_question.question.essay_question")
        .forEach(question => { 
          prompt[question.id] = `${data} \n\n\n CHATGPT, respond to the following text with simple short sentences at the level of a 9th grader: \n\n\n ${question.querySelector(".question_text.user_content").innerText}` 
        });
        console.log(prompt);
      });
    }
    setTimeout(async () => {
      await browser.close();
    }, 180000);
  }

})();
