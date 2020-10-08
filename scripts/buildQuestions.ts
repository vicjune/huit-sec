// @ts-ignore
const fs = require('fs');
const { v4: genUuid } = require('uuid');

const rawQuestionsFile = 'src/json/raw-questions.json';
const parsedQuestionsFile = 'src/json/questions.json';

const readFile = (path: string) => {
  try {
    return JSON.parse(fs.readFileSync(path).toString());
  } catch (e) {
    console.error(e);
  }
};

const writeFile = (path: string, content: any) => {
  try {
    fs.writeFileSync(path, JSON.stringify(content));
  } catch (e) {
    console.error(e);
  }
};

const rawQuestions: string[] = readFile(rawQuestionsFile) || [];
const existingQuestions: { id: string; text: string }[] =
  readFile(parsedQuestionsFile) || [];

const parsedQuestions = rawQuestions
  .filter(
    (question) => !existingQuestions.find(({ text }) => text === question),
  )
  .map((question, i) => ({
    number: i + existingQuestions.length,
    id: genUuid(),
    text: question,
  }));

const mergedQuestions = [...existingQuestions, ...parsedQuestions];

writeFile(parsedQuestionsFile, mergedQuestions);
