// Sleep
export const sleep = async (): Promise<void> => new Promise((resolve) => setTimeout(resolve, Math.random() * 200 + 50))

// Ugly but quick way to deep-clone an object
export const clone = <T>(object: T): T => JSON.parse(JSON.stringify(object)) as T
