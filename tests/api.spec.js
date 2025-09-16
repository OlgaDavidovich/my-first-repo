import { test, expect } from '@playwright/test';

const BASE_URL = 'https://restful-booker.herokuapp.com';
const bookingData = {
    firstname: 'Tom',
    lastname: 'Brown',
    totalprice: 120,
    depositpaid: true,
    bookingdates: {
      checkin: '2025-10-01',
      checkout: '2025-10-03',
  },
  additionalneeds: 'Breakfast',
  };
  let authToken; 
  let bookingId;

// Все тесты лучше завернуть в блок test.describe('API-тесты для Restful-booker', () => {

test('1. Создание бронирования (Create - POST)', async ({ request }) => {
   const response = await request.post(`${BASE_URL}/booking`, {
    data: bookingData,
  });
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('bookingid');
  expect(responseBody.booking.firstname).toBe(bookingData.firstname); // С 25 по 31 строку можно использовать ассершн expect(responseBody.booking).toMatchObject(bookingData);
  expect(responseBody.booking.lastname).toBe(bookingData.lastname);
  expect(responseBody.booking.totalprice).toBe(bookingData.totalprice);
  expect(responseBody.booking.depositpaid).toBe(bookingData.depositpaid);
  expect(responseBody.booking.bookingdates.checkin).toBe(bookingData.bookingdates.checkin);
  expect(responseBody.booking.bookingdates.checkout).toBe(bookingData.bookingdates.checkout);
  expect(responseBody.booking.additionalneeds).toBe(bookingData.additionalneeds);
  bookingId = responseBody.bookingid;
  console.log("Бронирование успешно создано.  ID бронирования:", responseBody.bookingid);
 });

      test('2. Получение информации о бронировании (Read - GET)', async ({ request }) => { // уехали отступы по всему тесту
        expect(bookingId).toBeDefined();
        const response = await request.get(`${BASE_URL}/booking/${bookingId}`);
        console.log(`Статус-код: ${response.status()}`);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        console.log('Тело ответа:', responseBody);
        expect(responseBody.firstname).toBe(bookingData.firstname);
        expect(responseBody.lastname).toBe(bookingData.lastname);
        expect(responseBody.totalprice).toBe(bookingData.totalprice);
        expect(responseBody.depositpaid).toBe(bookingData.depositpaid);
        expect(responseBody.bookingdates.checkin).toBe(bookingData.bookingdates.checkin);
        expect(responseBody.bookingdates.checkout).toBe(bookingData.bookingdates.checkout);
        expect(responseBody.additionalneeds).toBe(bookingData.additionalneeds);
      });
    
test('3. Получение токена (POST)', async ({ request }) => { // 3 и 4 тесты нужно объединить в один тест
        const authResponse = await request.post(`${BASE_URL}/auth`,{
        data: {
          username: 'admin',
          password: 'password123',
        },
});
expect(authResponse.status()).toBe(200);
    const authResponseBody = await authResponse.json();
    expect(authResponseBody).toHaveProperty('token');
    console.log(`Статус ответа: ${authResponse.status()}`);  // Консоль логи из тестов убираем
    authToken = authResponseBody.token; 
    console.log(`Токен авторизации получен: ${authToken}`);
    expect(authToken).not.toBeNull();
    expect(authToken).not.toBe('');
});

  test('4. Обновление бронирования (Update - PUT)', async ({ request }) => {
    if (!authToken || !bookingId) {
      console.warn("Пропускаем тест: отсутствует токен или ID бронирования.");
      return;}
    const updatedBookingData = {
      firstname: 'Bob',
      lastname: 'Brown',
      totalprice: 150,
      depositpaid: false,
      bookingdates: {
        checkin: '2025-10-10',
        checkout: '2025-10-15',
      },
      additionalneeds: 'Breskfast',
    };
  
    const putResponse = await request.put(`${BASE_URL}/booking/${bookingId}`, {
      data: updatedBookingData,
      headers: {
        Cookie: `token=${authToken}`,
      },
    });
    expect(putResponse.status()).toBe(200);
    const putResponseBody = await putResponse.json();
    console.log('Тело ответа:', putResponseBody);
    expect(putResponseBody.firstname).toBe(updatedBookingData.firstname); // Аналогично можно проверять в одну строку
    expect(putResponseBody.lastname).toBe(updatedBookingData.lastname);
    expect(putResponseBody.totalprice).toBe(updatedBookingData.totalprice);
    expect(putResponseBody.depositpaid).toBe(updatedBookingData.depositpaid);
    expect(putResponseBody.bookingdates.checkin).toBe(updatedBookingData.bookingdates.checkin);
    expect(putResponseBody.bookingdates.checkout).toBe(updatedBookingData.bookingdates.checkout);
    expect(putResponseBody.additionalneeds).toBe(updatedBookingData.additionalneeds);
    console.log(`Бронирование с ID ${bookingId} успешно обновлено.`);
  });

  test('5. Удаление бронирования (Delete - DELETE)', async ({ request }) => { // 5 и 6 тесты нужно объединить в один тест
      const deleteResponse = await request.delete(`${BASE_URL}/booking/${bookingId}`, {
          headers: {
        Cookie: `token=${authToken}`,
      },
    });
      expect(deleteResponse.status()).toBe(201);
      console.log(`Бронирование с ID ${bookingId} успешно удалено.`);
   })

   test('6. Проверка удаления брониования GET', async ({ request }) => { 
    const checkResponse = await request.get(`${BASE_URL}/booking/${bookingId}`);
    console.log(`Статус-код: ${checkResponse.status()}`);
    expect(checkResponse.status()).toBe(404);
  });
