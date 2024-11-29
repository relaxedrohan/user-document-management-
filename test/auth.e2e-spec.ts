// test/auth.e2e-spec.ts
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TestSetup } from './setup';
import { UserRole } from '@/users/enums/role.enum';
import { UsersService } from '@/users/users.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let editorToken: string;
  let testUserId: string;
  let usersService: UsersService;

  beforeAll(async () => {
    app = await TestSetup.createTestingApp();
    usersService = app.get(UsersService);

    const admin = await usersService.create({
      email: 'admin@test.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
    });
    await usersService.updateRole(admin.id, UserRole.ADMIN);
    testUserId = admin.id;

    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'admin123',
      });
    adminToken = adminLogin.body.access_token;

    const editor = await usersService.create({
      email: 'editor@test.com',
      password: 'editor123',
      firstName: 'Editor',
      lastName: 'User',
    });
    await usersService.updateRole(editor.id, UserRole.EDITOR);

    const editorLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'editor@test.com',
        password: 'editor123',
      });
    editorToken = editorLogin.body.access_token;
    testUserId = editor.id;
  });

  afterAll(async () => {
    await TestSetup.cleanup();
  });

  describe('GET /users', () => {
    it('should return 401 without token', () => {
      return request(app.getHttpServer()).get('/users').expect(401);
    });

    it('should return 403 for non-admin users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${editorToken}`)
        .expect(403);
    });

    it('should return all users for admin', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          email: expect.any(String),
          firstName: expect.any(String),
          lastName: expect.any(String),
          role: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
      expect(response.body[0]).not.toHaveProperty('password');
    });
  });

  describe('PUT /users/:id/role', () => {
    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .put(`/users/${testUserId}/role`)
        .send({ role: UserRole.EDITOR })
        .expect(401);
    });

    it('should return 403 for non-admin users', () => {
      return request(app.getHttpServer())
        .put(`/users/${testUserId}/role`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send({ role: UserRole.EDITOR })
        .expect(403);
    });

    it('should return 404 for non-existent user', () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      return request(app.getHttpServer())
        .put(`/users/${fakeId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: UserRole.EDITOR })
        .expect(404);
    });

    it('should update user role successfully', async () => {
      const response = await request(app.getHttpServer())
        .put(`/users/${testUserId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: UserRole.VIEWER })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: testUserId,
          role: UserRole.VIEWER,
        }),
      );

      const userResponse = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const updatedUser = userResponse.body.find((u) => u.id === testUserId);
      expect(updatedUser.role).toBe(UserRole.VIEWER);
    });

    it('should reject invalid role values', () => {
      return request(app.getHttpServer())
        .put(`/users/${testUserId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'INVALID_ROLE' })
        .expect(400);
    });
  });
});
