export default function factory() {
	return {
		files: ['**/*/*.test.*', '!dist/**/*'],
		require: ['@babel/register'],
		babel: true,
		failWithoutAssertions: true,
	};
}
