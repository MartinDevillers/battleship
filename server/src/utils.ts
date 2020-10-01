// Sleep
export const sleep = async (): Promise<void> => new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 100))

// Ugly but quick way to deep-clone an object
export const clone = <T>(object: T): T => JSON.parse(JSON.stringify(object)) as T
