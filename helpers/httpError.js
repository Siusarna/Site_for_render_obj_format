class HttpError extends Error {
  constructor(status = 'bar', message, ...params) {
    // Передати залишкові параметри (в тому числі параметри розробника) до батьківського конструктора
    super(...params);

    // Підтримує правильне трасування стеку в точці, де була викинута помилка (працює лише на V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }

    this.name = 'CustomError';
    // Користувацька інформація для налагодження
    this.status = status;
    this.date = new Date();
    this.message = message;
  }
}

module.exports = HttpError;
