import { BundleId } from '../src/const/bundles';
import { Question } from '../src/utils/globalState/questions';

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

const getBundle = (questionNumber: number) => {
  if (questionNumber <= 100) return BundleId.base;
  if (questionNumber <= 200) return BundleId.bundle_1;
  if (questionNumber <= 300) return BundleId.bundle_2;
  return BundleId.bundle_3;
};

const rawQuestions: string[] = readFile(rawQuestionsFile) || [];
const existingQuestions: Question[] = readFile(parsedQuestionsFile) || [];

const parsedQuestions: Question[] = rawQuestions
  .filter(
    (question) => !existingQuestions.find(({ text }) => text === question),
  )
  .map((question, i) => {
    const number = i + existingQuestions.length + 1;

    return {
      number,
      id: genUuid(),
      text: question,
      bundle: getBundle(number),
    };
  });

const mergedQuestions = [...existingQuestions, ...parsedQuestions];

writeFile(parsedQuestionsFile, mergedQuestions);
