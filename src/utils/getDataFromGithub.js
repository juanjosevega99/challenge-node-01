/* eslint-disable no-console */
const puppeteer = require('puppeteer');
const config = require('./config');
const getTime = require('./getTime');
const postToSlack = require('./postToSlack');

const getDataFromGithub = async (githubUser) => {
  console.log('Launch Puppeteer');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const GIT_HUB_URL = config.GIT_HUB_URL();

  await page.goto(`${GIT_HUB_URL}${githubUser}`);
  await page.screenshot({ path: `./src/images/${getTime()}-${githubUser}.png` });

  const githubCounter = await page.evaluate(() => document.getElementsByClassName('Counter')[0].innerText);
  const githubUserPhoto = await page.evaluate(() => document.getElementsByClassName('avatar-before-user-status')[0].src);

  await postToSlack(githubUser, githubUserPhoto, githubCounter);

  await browser.close();
};

module.exports = getDataFromGithub;
