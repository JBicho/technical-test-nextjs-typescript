const fs = jest.createMockFromModule('fs'); // Create a base mock from fs module

fs.promises = {
  readFile: jest.fn(),
};

fs.existsSync = jest.fn().mockReturnValue(true);

fs.stat = jest.fn().mockResolvedValue({
  isFile: jest.fn().mockReturnValue(true),
});

module.exports = fs;
