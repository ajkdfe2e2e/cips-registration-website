// CIPS网站功能验证脚本
console.log('🚀 开始验证CIPS社团网站功能...');

// 验证DOM结构
function validateDOMStructure() {
    console.log('\n📋 验证DOM结构...');
    
    const requiredElements = [
        { selector: '.navbar', name: '导航栏' },
        { selector: '.nav-brand', name: '导航品牌' },
        { selector: '.nav-menu', name: '导航菜单' },
        { selector: '.mobile-menu-btn', name: '移动端菜单按钮' },
        { selector: '#home', name: '首页区域' },
        { selector: '.hero-section', name: '英雄区域' },
        { selector: '.hero-stats', name: '统计数据' },
        { selector: '#about', name: '关于我们' },
        { selector: '.about-features', name: '特色功能' },
        { selector: '#activities', name: '活动介绍' },
        { selector: '.activities-grid', name: '活动网格' },
        { selector: '#join', name: '加入我们' },
        { selector: '#registrationForm', name: '报名表单' },
        { selector: '#contact', name: '联系我们' },
        { selector: '#successModal', name: '成功模态框' },
        { selector: '.footer', name: '页脚' }
    ];
    
    let passed = 0;
    let total = requiredElements.length;
    
    requiredElements.forEach(element => {
        const exists = !!document.querySelector(element.selector);
        if (exists) {
            console.log(`✅ ${element.name}: 存在`);
            passed++;
        } else {
            console.log(`❌ ${element.name}: 缺失 (${element.selector})`);
        }
    });
    
    console.log(`\n📊 DOM结构验证结果: ${passed}/${total} 通过`);
    return passed === total;
}

// 验证表单字段
function validateFormFields() {
    console.log('\n📝 验证表单字段...');
    
    const requiredFields = [
        { id: 'name', name: '姓名' },
        { id: 'studentId', name: '学号' },
        { id: 'college', name: '学院' },
        { id: 'major', name: '专业' },
        { id: 'grade', name: '年级' },
        { id: 'phone', name: '联系电话' },
        { id: 'email', name: '邮箱地址' },
        { id: 'experience', name: '编程经验' },
        { id: 'motivation', name: '加入动机' }
    ];
    
    let passed = 0;
    let total = requiredFields.length;
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            console.log(`✅ ${field.name}: 存在 (${element.tagName.toLowerCase()})`);
            passed++;
        } else {
            console.log(`❌ ${field.name}: 缺失 (ID: ${field.id})`);
        }
    });
    
    console.log(`\n📊 表单字段验证结果: ${passed}/${total} 通过`);
    return passed === total;
}

// 验证CSS样式
function validateStyles() {
    console.log('\n🎨 验证CSS样式...');
    
    const testElement = document.querySelector('.navbar');
    if (!testElement) {
        console.log('❌ 无法找到测试元素');
        return false;
    }
    
    const styles = window.getComputedStyle(testElement);
    const hasStyles = styles.position === 'fixed' && styles.zIndex === '1000';
    
    if (hasStyles) {
        console.log('✅ CSS样式已正确加载');
        return true;
    } else {
        console.log('❌ CSS样式可能未正确加载');
        return false;
    }
}

// 验证JavaScript功能
function validateJavaScript() {
    console.log('\n⚡验证JavaScript功能...');
    
    const tests = [
        {
            name: '表单验证函数',
            test: () => typeof showNotification === 'function'
        },
        {
            name: '模态框控制函数',
            test: () => typeof closeModal === 'function'
        },
        {
            name: '事件监听器',
            test: () => {
                const form = document.getElementById('registrationForm');
                return form && form.onsubmit !== null;
            }
        }
    ];
    
    let passed = 0;
    
    tests.forEach(test => {
        try {
            if (test.test()) {
                console.log(`✅ ${test.name}: 正常`);
                passed++;
            } else {
                console.log(`❌ ${test.name}: 异常`);
            }
        } catch (error) {
            console.log(`❌ ${test.name}: 错误 - ${error.message}`);
        }
    });
    
    console.log(`\n📊 JavaScript功能验证结果: ${passed}/${tests.length} 通过`);
    return passed === tests.length;
}

// 验证响应式设计
function validateResponsive() {
    console.log('\n📱 验证响应式设计...');
    
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileBtn && navMenu) {
        console.log('✅ 移动端导航元素存在');
        
        // 检查CSS媒体查询
        const mobileStyles = window.getComputedStyle(mobileBtn);
        console.log(`📱 移动端按钮显示状态: ${mobileStyles.display}`);
        
        return true;
    } else {
        console.log('❌ 移动端导航元素缺失');
        return false;
    }
}

// 验证无障碍功能
function validateAccessibility() {
    console.log('\n♿ 验证无障碍功能...');
    
    const checks = [
        {
            name: 'Alt属性',
            test: () => {
                const images = document.querySelectorAll('img');
                return Array.from(images).every(img => img.alt);
            }
        },
        {
            name: 'Label关联',
            test: () => {
                const labels = document.querySelectorAll('label[for]');
                return Array.from(labels).every(label => 
                    document.getElementById(label.getAttribute('for'))
                );
            }
        },
        {
            name: 'ARIA标签',
            test: () => {
                const ariaElements = document.querySelectorAll('[aria-label]');
                return ariaElements.length > 0;
            }
        }
    ];
    
    let passed = 0;
    
    checks.forEach(check => {
        if (check.test()) {
            console.log(`✅ ${check.name}: 通过`);
            passed++;
        } else {
            console.log(`❌ ${check.name}: 需要改进`);
        }
    });
    
    console.log(`\n📊 无障碍功能验证结果: ${passed}/${checks.length} 通过`);
    return passed === checks.length;
}

// 运行所有验证
function runAllValidations() {
    console.log('🎯 CIPS社团网站完整性验证报告');
    console.log('='.repeat(50));
    
    const results = {
        dom: validateDOMStructure(),
        form: validateFormFields(),
        styles: validateStyles(),
        javascript: validateJavaScript(),
        responsive: validateResponsive(),
        accessibility: validateAccessibility()
    };
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(Boolean).length;
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 总体验证结果:');
    console.log(`✅ 通过: ${passedTests}/${totalTests} 项测试`);
    console.log(`📈 成功率: ${Math.round(passedTests / totalTests * 100)}%`);
    
    if (passedTests === totalTests) {
        console.log('🎉 恭喜！所有功能验证通过，网站已准备就绪！');
    } else {
        console.log('⚠️  部分功能需要检查，请查看上述详细信息。');
    }
    
    return results;
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAllValidations);
    } else {
        runAllValidations();
    }
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAllValidations };
}
