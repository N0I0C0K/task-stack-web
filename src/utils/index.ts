export function formatSeconds(seconds: number) {
	const d = new Date(seconds * 1000)
	return `${d.getFullYear()}/${(d.getMonth() + 1)
		.toString()
		.padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')} ${d
		.getHours()
		.toString()
		.padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d
		.getSeconds()
		.toString()
		.padStart(2, '0')}`
}

export function countArrayPredicate<T>(
	arr: T[],
	predicate: (item: T) => boolean
) {
	let count = 0
	for (const item of arr) {
		if (predicate(item)) {
			count++
		}
	}
	return count
}
