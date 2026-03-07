# 🐰 CodeRabbit Setup Guide for AI Forensic Engine

## What is CodeRabbit?

CodeRabbit is an AI-powered code review tool that automatically reviews your pull requests on GitHub, providing:
- Security vulnerability detection
- Code quality suggestions
- Best practice recommendations
- Performance optimization tips

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Your code in a GitHub repository
- ✅ Repository: https://github.com/sumeetudgire005-star/AI-FORENSICS0-2.git

---

## 🚀 Step-by-Step Setup

### Step 1: Prepare Your GitHub Repository

1. **Go to your repository**:
   ```
   https://github.com/sumeetudgire005-star/AI-FORENSICS0-2
   ```

2. **Ensure your code is pushed**:
   ```bash
   cd C:\Users\vidyasagar\OneDrive\Desktop\kiroproject
   git add .
   git commit -m "Add forensic engine code for review"
   git push origin main
   ```

---

### Step 2: Sign Up for CodeRabbit

1. **Visit CodeRabbit**:
   ```
   https://coderabbit.ai
   ```

2. **Click "Sign in with GitHub"**

3. **Authorize CodeRabbit**:
   - Click "Authorize CodeRabbit"
   - Grant access to your repositories

---

### Step 3: Install CodeRabbit GitHub App

1. **Click "Install CodeRabbit"** on the dashboard

2. **Choose repository access**:
   - Option A: All repositories (easier)
   - Option B: Only select repositories
     - Select: `AI-FORENSICS0-2`

3. **Click "Install"**

4. **Confirm installation**

---

### Step 4: Configure CodeRabbit (Optional)

Create a `.coderabbit.yaml` file in your repository root:

```yaml
# .coderabbit.yaml
language: "en-US"
early_access: false
reviews:
  profile: "chill"  # Options: chill, assertive
  request_changes_workflow: false
  high_level_summary: true
  poem: false
  review_status: true
  collapse_walkthrough: false
  auto_review:
    enabled: true
    drafts: false
  tools:
    shellcheck:
      enabled: true
    ruff:
      enabled: true
    markdownlint:
      enabled: true
    github-checks:
      enabled: true
      timeout: 5m
chat:
  auto_reply: true
```

---

### Step 5: Create Your First Pull Request

#### Option A: Using GitHub Web Interface

1. **Go to your repository**:
   ```
   https://github.com/sumeetudgire005-star/AI-FORENSICS0-2
   ```

2. **Click "Pull requests" tab**

3. **Click "New pull request"**

4. **Select branches**:
   - Base: `main`
   - Compare: Create a new branch first (see below)

#### Option B: Using Git Commands (Recommended)

```bash
# Navigate to your project
cd C:\Users\vidyasagar\OneDrive\Desktop\kiroproject

# Create a new branch for your changes
git checkout -b feature/code-review-fixes

# Make some changes (or use existing changes)
# For example, let's add the CODE_REVIEW_REPORT.md
git add CODE_REVIEW_REPORT.md
git commit -m "Add comprehensive code review report"

# Push the branch to GitHub
git push origin feature/code-review-fixes

# Now go to GitHub and create a Pull Request
```

---

### Step 6: Create Pull Request on GitHub

1. **Go to your repository**:
   ```
   https://github.com/sumeetudgire005-star/AI-FORENSICS0-2
   ```

2. **You'll see a banner**: "Compare & pull request" - Click it

3. **Fill in PR details**:
   - Title: `Code Review Fixes - Security & Performance Improvements`
   - Description:
     ```markdown
     ## Changes
     - Added comprehensive code review report
     - Identified 16 issues (3 critical, 3 high priority)
     - Documented security vulnerabilities
     - Provided implementation guides
     
     ## Review Focus
     - Security vulnerabilities (file upload, CORS, input validation)
     - Performance issues (async I/O, caching)
     - Code quality improvements
     
     @coderabbit please review this PR with focus on security
     ```

4. **Click "Create pull request"**

---

### Step 7: CodeRabbit Automatic Review

Once you create the PR:

1. **CodeRabbit will automatically**:
   - ✅ Analyze all changed files
   - ✅ Check for security issues
   - ✅ Review code quality
   - ✅ Suggest improvements
   - ✅ Add inline comments

2. **Wait 1-2 minutes** for the review to complete

3. **Check the PR** for CodeRabbit's comments

---

## 🎯 Example Pull Request Workflow

### Scenario: Fix Security Issues

```bash
# 1. Create a branch for security fixes
git checkout -b fix/security-vulnerabilities

# 2. Make changes to main.py (add file validation)
# Edit main.py with the fixes from CODE_REVIEW_REPORT.md

# 3. Commit changes
git add main.py
git commit -m "Fix: Add file upload validation and sanitization

- Add file size limit (50MB)
- Sanitize filenames to prevent path traversal
- Validate MIME types
- Add proper error handling

Fixes security issues #1, #2, #3 from code review"

# 4. Push to GitHub
git push origin fix/security-vulnerabilities

# 5. Create PR on GitHub
# CodeRabbit will automatically review it!
```

---

## 💬 Interacting with CodeRabbit

### In Pull Request Comments:

```markdown
@coderabbit review
```
Triggers a new review

```markdown
@coderabbit summary
```
Gets a summary of the changes

```markdown
@coderabbit resolve
```
Marks a conversation as resolved

```markdown
@coderabbit help
```
Shows available commands

### Ask Questions:

```markdown
@coderabbit Is this implementation secure?
```

```markdown
@coderabbit Can you suggest a better approach for this function?
```

```markdown
@coderabbit What are the performance implications of this change?
```

---

## 📊 CodeRabbit Review Example

After creating a PR, CodeRabbit will comment like this:

```markdown
## CodeRabbit Review

### Summary
This PR adds file upload validation to address security vulnerabilities.

### Issues Found: 2

#### 🔴 Critical: Missing MIME type validation
**File**: `main.py:52`
**Issue**: File content is not validated against declared MIME type

**Suggestion**:
```python
import magic
mime_type = magic.from_buffer(content, mime=True)
if mime_type not in ALLOWED_TYPES:
    raise HTTPException(400, "Invalid file type")
```

#### 🟡 Medium: Hardcoded file size limit
**File**: `main.py:48`
**Issue**: File size limit is hardcoded

**Suggestion**: Move to configuration file
```

---

## 🔧 Advanced Configuration

### Custom Review Rules

Create `.coderabbit.yaml`:

```yaml
reviews:
  # Focus areas
  path_filters:
    - "!demo_evidence/**"  # Ignore demo files
    - "!tests/**"          # Ignore test files
  
  # Custom instructions
  path_instructions:
    - path: "models/**"
      instructions: |
        Focus on:
        - ML model security
        - Input validation
        - Error handling
    
    - path: "pipeline/**"
      instructions: |
        Focus on:
        - Data pipeline security
        - Performance optimization
        - Async/await patterns
    
    - path: "main.py"
      instructions: |
        Focus on:
        - API security (CORS, rate limiting)
        - Input validation
        - Error handling
        - Authentication

  # Auto-approve minor changes
  auto_approve:
    enabled: true
    conditions:
      - "Documentation updates"
      - "README changes"
      - "Comment additions"
```

---

## 🎓 Best Practices

### 1. Small, Focused PRs
```bash
# ❌ Bad: One huge PR
git commit -m "Fix everything"

# ✅ Good: Multiple small PRs
git commit -m "Fix: Add file upload validation"
git commit -m "Fix: Implement rate limiting"
git commit -m "Fix: Add proper logging"
```

### 2. Descriptive Commit Messages
```bash
# ❌ Bad
git commit -m "fix bug"

# ✅ Good
git commit -m "Fix: Prevent path traversal in file upload

- Sanitize filenames using regex
- Validate file paths are within allowed directory
- Add unit tests for path validation

Fixes #1 from security audit"
```

### 3. Request Specific Reviews
```markdown
@coderabbit please review this PR focusing on:
1. Security vulnerabilities in file handling
2. Performance of async operations
3. Error handling completeness
```

---

## 🐛 Troubleshooting

### CodeRabbit Not Reviewing?

1. **Check installation**:
   - Go to: https://github.com/settings/installations
   - Verify CodeRabbit is installed
   - Check repository access

2. **Check PR status**:
   - PR must be open (not draft)
   - PR must have changes
   - Branch must be pushed to GitHub

3. **Trigger manually**:
   ```markdown
   @coderabbit review
   ```

### CodeRabbit Comments Not Appearing?

1. **Wait 2-3 minutes** - AI analysis takes time
2. **Check GitHub Actions** tab for errors
3. **Refresh the PR page**

### Need to Re-review?

```markdown
@coderabbit review --force
```

---

## 📈 Measuring Impact

### Before CodeRabbit:
- Manual code reviews take hours
- Security issues missed
- Inconsistent review quality

### After CodeRabbit:
- ✅ Instant automated reviews
- ✅ Security issues caught early
- ✅ Consistent review standards
- ✅ Learning from AI suggestions

---

## 🎯 Quick Start Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] CodeRabbit account created
- [ ] CodeRabbit GitHub App installed
- [ ] `.coderabbit.yaml` configuration added
- [ ] First branch created
- [ ] First PR created
- [ ] CodeRabbit review received
- [ ] Responded to CodeRabbit comments
- [ ] Merged PR after approval

---

## 📚 Additional Resources

- **CodeRabbit Docs**: https://docs.coderabbit.ai
- **GitHub PR Guide**: https://docs.github.com/en/pull-requests
- **Git Tutorial**: https://git-scm.com/docs/gittutorial

---

## 🆘 Need Help?

1. **CodeRabbit Support**: support@coderabbit.ai
2. **GitHub Issues**: Create an issue in your repository
3. **Community**: https://github.com/coderabbitai/coderabbit/discussions

---

**Last Updated**: March 7, 2026  
**Version**: 1.0  
**Author**: Kiro AI Assistant
