import { Faker, faker } from '@faker-js/faker'

export const getFakeOutput = (num: number = 10) => {
	return faker.lorem.sentences(num)
}
