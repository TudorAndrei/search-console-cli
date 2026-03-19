import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveRepo } from '../src/setup.js';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

vi.mock('child_process', () => ({
    execSync: vi.fn(),
}));

vi.mock('fs', () => ({
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
}));

describe('Setup Wizard - Repository Resolution', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should resolve repo from git remote origin', () => {
        vi.mocked(execSync).mockReturnValue('https://github.com/owner/repo.git');

        const result = resolveRepo('/fake/dir');

        expect(result).toBe('owner/repo');
        expect(execSync).toHaveBeenCalledWith(
            'git remote get-url origin',
            expect.objectContaining({ encoding: 'utf8' })
        );
    });

    it('should resolve repo from git ssh url', () => {
        vi.mocked(execSync).mockReturnValue('git@github.com:owner/repo.git');

        const result = resolveRepo('/fake/dir');

        expect(result).toBe('owner/repo');
    });

    it('should fallback to package.json if git fails', () => {
        vi.mocked(execSync).mockImplementation(() => {
            throw new Error('git failed');
        });
        vi.mocked(existsSync).mockReturnValue(true);
        vi.mocked(readFileSync).mockReturnValue(JSON.stringify({
            repository: {
                url: 'https://github.com/fallback/repo'
            }
        }));

        const result = resolveRepo('/fake/dir');

        expect(result).toBe('fallback/repo');
    });

    it('should fallback to repoSlug if repository url is missing', () => {
        vi.mocked(execSync).mockImplementation(() => {
            throw new Error('git failed');
        });
        vi.mocked(existsSync).mockReturnValue(true);
        vi.mocked(readFileSync).mockReturnValue(JSON.stringify({
            repoSlug: 'owner/repo'
        }));

        const result = resolveRepo('/fake/dir');

        expect(result).toBe('owner/repo');
    });

    it('should resolve the actual project repo correctly (saurabhsharma2u/search-console-cli)', () => {
        vi.mocked(execSync).mockImplementation(() => {
            throw new Error('git failed');
        });
        vi.mocked(existsSync).mockReturnValue(true);
        vi.mocked(readFileSync).mockReturnValue(JSON.stringify({
            repoSlug: 'saurabhsharma2u/search-console-cli'
        }));

        const result = resolveRepo('/fake/dir');

        expect(result).toBe('saurabhsharma2u/search-console-cli');
    });

    it('should return empty string if everything fails', () => {
        vi.mocked(execSync).mockImplementation(() => {
            throw new Error('git failed');
        });
        vi.mocked(existsSync).mockReturnValue(false);

        const result = resolveRepo('/fake/dir');

        expect(result).toBe('');
    });
});
