import { test, expect, API_URL } from '../fixtures/test-fixtures';

/**
 * FLOW 1 - FR-02: Đăng nhập & Khóa tài khoản.
 *
 * Nguyên tắc: locator bám DOM thật, assertion bám ĐẶC TẢ.
 * Test nào FAIL ở đây = SUT vi phạm đặc tả, không phải test viết sai.
 */
test.describe('FR-02 Đăng nhập & khóa tài khoản', () => {
  test('TC-L1: đăng nhập đúng thì vào được trang chủ', async ({ page, loginPage, freshUser }) => {
    await loginPage.goto();
    await loginPage.login(freshUser.email, freshUser.password);

    // Đăng nhập xong navigate('/') và header đổi sang trạng thái đã đăng nhập.
    await expect(page).toHaveURL('http://localhost:5173/');
    await expect(page.getByRole('link', { name: /Chào,/ })).toBeVisible();
  });

  test('TC-L2: sai mật khẩu thì hiện thông báo lỗi', async ({ loginPage, freshUser }) => {
    await loginPage.goto();
    await loginPage.login(freshUser.email, 'SaiMatKhau!');

    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('TC-L3 [FR-22]: ô mật khẩu phải là type="password"', async ({ loginPage }) => {
    await loginPage.goto();

    // FR-22: "Trường Mật khẩu phải dùng type='password' (không hiển thị rõ)".
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('TC-L4 [FR-02]: mỗi lần sai chỉ tăng bộ đếm 1 đơn vị, chưa khóa sau 2 lần', async ({
    api,
    freshUser,
  }) => {
    // Oracle đặt ở tầng API vì UI nuốt hết mọi lỗi thành một câu chung chung
    // ("Đăng nhập thất bại. Vui lòng kiểm tra lại.") -> không phân biệt được sai-mật-khẩu
    // với bị-khóa. Đây chính là lý do phải kiểm tra ở tầng dưới UI.
    const wrong = { email: freshUser.email, password: 'SaiMatKhau!' };

    const first = await api.post('/api/login', { data: wrong });
    expect(first.status(), 'lần sai thứ 1 phải là 401').toBe(401);

    const second = await api.post('/api/login', { data: wrong });
    expect(second.status(), 'lần sai thứ 2 phải là 401').toBe(401);

    // FR-02: chỉ bị khóa khi sai TỪ 3 LẦN TRỞ LÊN. Sau 2 lần sai, đăng nhập ĐÚNG
    // vẫn phải thành công.
    const good = await api.post('/api/login', {
      data: { email: freshUser.email, password: freshUser.password },
    });
    expect(good.status(), 'sau 2 lần sai, mật khẩu đúng vẫn phải đăng nhập được').toBe(200);
  });

  test('TC-L5 [FR-02]: khóa tài khoản đúng 30 giây', async ({ api, freshUser }) => {
    // Test này chủ động chờ hết 30s khóa -> phải nới timeout mặc định (30s).
    test.setTimeout(60_000);

    const wrong = { email: freshUser.email, password: 'SaiMatKhau!' };
    for (let i = 0; i < 3; i++) {
      await api.post('/api/login', { data: wrong });
    }

    const locked = await api.post('/api/login', {
      data: { email: freshUser.email, password: freshUser.password },
    });
    expect(locked.status(), 'sai >= 3 lần thì phải bị khóa').toBe(403);

    // FR-02: "tài khoản bị tạm khóa 30 giây (môi trường demo)".
    // Chờ 31s rồi thử lại -> phải mở khóa.
    await new Promise((r) => setTimeout(r, 31_000));

    const afterUnlock = await api.post('/api/login', {
      data: { email: freshUser.email, password: freshUser.password },
    });
    expect(afterUnlock.status(), 'sau 30 giây tài khoản phải được mở khóa').toBe(200);
  });
});

test('smoke: backend đang chạy', async ({ api }) => {
  const res = await api.get('/api/products');
  expect(res.ok(), `không gọi được ${API_URL}/api/products`).toBeTruthy();
});
