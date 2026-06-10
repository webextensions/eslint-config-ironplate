// Exercises "@stylistic/member-delimiter-style" (semicolon delimiters) and "@stylistic/type-annotation-spacing"
interface FixtureConfig {
    name: string;
    count: number
}

const fixtureConfig: FixtureConfig = {
    name: 'typescript-fixture',
    count: 1
};
console.log(fixtureConfig);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unusedVariable: string = 'proves @typescript-eslint rules are active on .ts files';

export { fixtureConfig };
