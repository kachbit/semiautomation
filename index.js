const puppeteer = require('puppeteer');

// enter in church signin details:
const email = ""
const password = ""

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
            const dueDateElements = document.querySelectorAll('.due_date_display');
            console.log('test111', dueDateElements);

            for (const element of dueDateElements) {
              if (element.innerText.replace(/(\r\n|\n|\r)/gm, "") === currentDate) {
                console.log("aaa");
                element.parentNode.parentNode.querySelector(".module-item-title").firstElementChild.firstElementChild.id = "currentLesson_hack2349";
                const siblingTitleElement = "currentLesson_hack2349";
                console.log('final', siblingTitleElement);
                resolve(siblingTitleElement);
                return;
              }
              console.log('v', element.innerText.replace(/(\r\n|\n|\r)/gm, ""));
            }

            resolve(null);
          }, 2100);
        });
      });

      console.log("check", matchingDueDateElement);

      if (matchingDueDateElement) {
        console.log(matchingDueDateElement);
        await page.waitForSelector('#currentLesson_hack2349');
        console.log("92378")
        page.$eval(`#currentLesson_hack2349`, element =>
          element.click()
        );
        console.log("222")
      }

      setTimeout(async () => {
        await browser.close();
      }, 180000);
    }

  })();
