import { test, expect } from '@playwright/test';

test.describe('API-тесты для Restful-booker  @api' , () => {

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

 test('1. Создание бронирования (Create - POST)', async ({ request }) => {
   const response = await request.post(`${BASE_URL}/booking`, {
    data: bookingData,
  });

  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('bookingid');
  expect(responseBody.booking).toMatchObject(bookingData);
  bookingId = responseBody.bookingid;
  console.log("Бронирование успешно создано.  ID бронирования:", responseBody.bookingid);
 });

  test('2. Получение информации о бронировании (Read - GET)', async ({ request }) => {
   expect(bookingId).toBeDefined();
   const response = await request.get(`${BASE_URL}/booking/${bookingId}`);
   expect(response.status()).toBe(200);
   const responseBody = await response.json();
   expect(responseBody).toMatchObject(bookingData);
  });
    
  test('3. Получение токена (POST) и обновление бронирования (Update - PUT)', async ({ request }) => {
    const authResponse = await request.post(`${BASE_URL}/auth`,{
      data: {
        username: 'admin',
        password: 'password123',
      },
  });

  expect(authResponse.status()).toBe(200);
  const authResponseBody = await authResponse.json();
  expect(authResponseBody).toHaveProperty('token');
  authToken = authResponseBody.token; 
  expect(authToken).not.toBeNull();
  expect(authToken).not.toBe('');

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
    expect(putResponseBody).toMatchObject(updatedBookingData);
    console.log(`Бронирование с ID ${bookingId} успешно обновлено.`);
  });

  test('4. Удаление бронирования (Delete - DELETE) и проверка удаления брониования GET', async ({ request }) => {
      const deleteResponse = await request.delete(`${BASE_URL}/booking/${bookingId}`, {
          headers: {
        Cookie: `token=${authToken}`,
      },
    });

    expect(deleteResponse.status()).toBe(201);
    console.log(`Бронирование с ID ${bookingId} успешно удалено.`);
    const checkResponse = await request.get(`${BASE_URL}/booking/${bookingId}`);
    expect(checkResponse.status()).toBe(404);
   })
})