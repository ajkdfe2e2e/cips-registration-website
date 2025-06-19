// CIPS社团报名网站交互功能
document.addEventListener('DOMContentLoaded', function() {
    
    // 移动端导航菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
    
    // 平滑滚动导航
    const navLinks = document.querySelectorAll('.nav-menu a, .hero-buttons a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70; // 考虑导航栏高度
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // 关闭移动端菜单
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        const icon = mobileMenuBtn.querySelector('i');
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });
    
    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // 添加透明度效果
        if (currentScroll > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.backgroundColor = 'var(--bg-primary)';
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
    
    // 滚动动画观察器
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.feature-card, .activity-card, .contact-item, .team-member');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // 统计数字动画
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/\D/g, ''));
            let current = 0;
            const increment = target / 100;
            const suffix = stat.textContent.replace(/\d/g, '');
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + suffix;
                }
            }, 20);
        });
    }
    
    // 当统计区域进入视窗时开始动画
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
    
    // 表单处理
    const registrationForm = document.getElementById('registrationForm');
    const successModal = document.getElementById('successModal');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // 验证必填字段
            const requiredFields = ['name', 'studentId', 'college', 'major', 'grade', 'phone'];
            let isValid = true;
            
            requiredFields.forEach(field => {
                const input = document.getElementById(field);
                if (!data[field] || data[field].trim() === '') {
                    input.style.borderColor = 'var(--danger-color)';
                    isValid = false;
                    
                    // 3秒后恢复边框颜色
                    setTimeout(() => {
                        input.style.borderColor = 'var(--border-color)';
                    }, 3000);
                } else {
                    input.style.borderColor = 'var(--border-color)';
                }
            });
            
            if (!isValid) {
                showNotification('请填写所有必填字段', 'error');
                return;
            }
            
            // 验证手机号格式
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(data.phone)) {
                document.getElementById('phone').style.borderColor = 'var(--danger-color)';
                showNotification('请输入正确的手机号码', 'error');
                return;
            }
            
            // 验证邮箱格式（如果填写了）
            if (data.email && data.email.trim() !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    document.getElementById('email').style.borderColor = 'var(--danger-color)';
                    showNotification('请输入正确的邮箱地址', 'error');
                    return;
                }
            }
            
            // 模拟提交过程
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '提交中...';
            submitBtn.disabled = true;
            
            // 模拟网络请求
            setTimeout(() => {
                // 保存报名信息到本地存储
                const registrations = JSON.parse(localStorage.getItem('cips_registrations') || '[]');
                data.timestamp = new Date().toISOString();
                data.id = Date.now().toString();
                registrations.push(data);
                localStorage.setItem('cips_registrations', JSON.stringify(registrations));
                
                // 显示成功模态框
                showModal();
                
                // 重置表单
                this.reset();
                
                // 恢复提交按钮
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // 显示成功通知
                showNotification('报名提交成功！我们会尽快与您联系。', 'success');
            }, 2000);
        });
    }
    
    // 显示模态框
    function showModal() {
        if (successModal) {
            successModal.classList.add('active');
        }
    }
    
    // 关闭模态框
    window.closeModal = function() {
        if (successModal) {
            successModal.classList.remove('active');
        }
    }
    
    // 点击模态框背景关闭
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    // 通知系统
    function showNotification(message, type = 'info') {
        // 移除已存在的通知
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                         type === 'error' ? 'fa-exclamation-circle' : 
                         'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // 添加通知样式
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 
                        type === 'error' ? 'var(--danger-color)' : 
                        'var(--primary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 3000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 3秒后自动关闭
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }
    
    // 添加通知动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.25rem;
            margin-left: auto;
        }
        
        .notification-close:hover {
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);
    
    // 表单字段实时验证
    const formInputs = document.querySelectorAll('#registrationForm input, #registrationForm select, #registrationForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = 'var(--danger-color)';
            } else {
                this.style.borderColor = 'var(--border-color)';
                
                // 特殊验证
                if (this.type === 'tel' && this.value.trim()) {
                    const phoneRegex = /^1[3-9]\d{9}$/;
                    this.style.borderColor = phoneRegex.test(this.value) ? 'var(--success-color)' : 'var(--danger-color)';
                }
                
                if (this.type === 'email' && this.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    this.style.borderColor = emailRegex.test(this.value) ? 'var(--success-color)' : 'var(--danger-color)';
                }
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary-color)';
        });
    });
    
    // 页面加载完成动画
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 100);
    
    // 懒加载图片
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        // ESC关闭模态框
        if (e.key === 'Escape' && successModal && successModal.classList.contains('active')) {
            closeModal();
        }
        
        // Ctrl+Enter 快速提交表单（当表单获得焦点时）
        if (e.ctrlKey && e.key === 'Enter' && document.activeElement.closest('#registrationForm')) {
            e.preventDefault();
            registrationForm.dispatchEvent(new Event('submit'));
        }
    });
    
    console.log('🎉 CIPS社团报名网站加载完成！');
    console.log('📧 联系邮箱: cips@nyist.edu.cn');
    console.log('🌐 官方网站: https://cips.nyist.edu.cn');
});

// 初始页面样式
document.body.style.cssText = `
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
`;