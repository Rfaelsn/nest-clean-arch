import { BcryptjsHashProvider } from '../../bcryptjs-hash.provider';

describe('UserInMemoryRepository unit tests', () => {
  let sut: BcryptjsHashProvider;

  beforeEach(() => {
    sut = new BcryptjsHashProvider();
  });

  it('Should return encrypted password', async () => {
    const password = 'testPassword'
    const hash = await sut.generateHash(password);
    expect(hash).toBeDefined()
  });

  it('Should return false on invalid password and hash comparison', async () => {
    const password = 'testPassword'
    const hash = await sut.generateHash(password);
    const result = await sut.compareHash('fake',hash);
    expect(result).toBeFalsy();
  });

  it('Should return true on valid password and hash comparison', async () => {
    const password = 'testPassword'
    const hash = await sut.generateHash(password);
    const result = await sut.compareHash(password,hash);
    expect(result).toBeTruthy();
  });
});
