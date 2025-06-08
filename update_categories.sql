-- First, add the new columns
ALTER TABLE public.categories
ADD COLUMN description text,
ADD COLUMN overview text;

-- Update Selenium category
UPDATE public.categories
SET description = 'Selenium WebDriver is the most widely-used open source tool for web browser automation. As an SDET, mastering Selenium is crucial for creating robust, scalable test automation frameworks. This section covers everything from basic browser interactions to advanced automation patterns and best practices that will help you build reliable test suites.',
    overview = E'Setting up Selenium WebDriver with different programming languages\nLocating elements using various strategies (ID, CSS, XPath)\nHandling dynamic web elements and implementing smart waits\nAdvanced interactions like drag-and-drop and file uploads\nPage Object Model and other design patterns\nCross-browser testing strategies\nHandling frames, alerts, and popups\nIntegration with test frameworks like TestNG/JUnit\nBest practices for maintainable test automation\nPerformance optimization techniques'
WHERE slug = 'selenium';

-- Update API Testing category
UPDATE public.categories
SET description = 'API testing is a critical skill for modern SDETs. With the rise of microservices and REST APIs, ensuring the reliability and security of API endpoints has become more important than ever. Learn how to design and implement comprehensive API test suites using popular tools and frameworks.',
    overview = E'Understanding REST API concepts and architecture\nAPI testing tools like Postman, REST Assured, and Supertest\nWriting automated API tests with different frameworks\nRequest/Response validation strategies\nHandling authentication and authorization\nTesting API security and performance\nMocking and stubbing techniques\nAPI test automation best practices\nIntegration testing with microservices\nAPI documentation and contract testing'
WHERE slug = 'api-testing';

-- Update Performance Testing category
UPDATE public.categories
SET description = 'Performance testing ensures applications can handle expected and peak loads while maintaining responsiveness. As an SDET, you''ll learn how to design and execute various types of performance tests, analyze results, and make data-driven recommendations for optimization.',
    overview = E'Understanding different types of performance testing\nUsing JMeter and other performance testing tools\nDesigning realistic performance test scenarios\nLoad testing and stress testing techniques\nPerformance metrics and KPIs\nAnalyzing and reporting test results\nIdentifying performance bottlenecks\nScalability testing strategies\nCloud-based performance testing\nPerformance optimization recommendations'
WHERE slug = 'performance-testing';

-- Update CI/CD category
UPDATE public.categories
SET description = 'Continuous Integration and Continuous Deployment (CI/CD) are fundamental to modern software delivery. Learn how to integrate automated testing into CI/CD pipelines, ensure quality at every stage of delivery, and implement effective test automation strategies in an Agile environment.',
    overview = E'Understanding CI/CD concepts and principles\nSetting up CI/CD pipelines with Jenkins/GitLab\nAutomating test execution in pipelines\nTest environment management\nDocker and containerization basics\nTest reporting and notifications\nQuality gates and metrics\nDeployment automation strategies\nMonitoring and logging practices\nBest practices for CI/CD implementation'
WHERE slug = 'cicd';

-- Update Mobile Testing category
UPDATE public.categories
SET description = 'Mobile testing requires unique approaches and tools to ensure applications work flawlessly across different devices and platforms. Master the techniques and tools needed for comprehensive mobile application testing, from functional testing to performance and security.',
    overview = E'Mobile testing fundamentals and challenges\nAppium automation framework\nTesting on iOS and Android platforms\nMobile test automation strategies\nHandling different screen sizes and orientations\nMobile app performance testing\nMobile security testing basics\nTest automation for native and hybrid apps\nContinuous testing for mobile apps\nMobile test labs and device farms'
WHERE slug = 'mobile-testing';

-- Update Security Testing category
UPDATE public.categories
SET description = 'Security testing is essential in today''s threat landscape. Learn how to identify vulnerabilities, perform security assessments, and integrate security testing into your automation framework. This section covers essential security testing concepts and tools that every SDET should know.',
    overview = E'Security testing fundamentals\nOWASP Top 10 vulnerabilities\nSecurity testing tools and frameworks\nAutomated security scanning\nPenetration testing basics\nAPI security testing\nWeb application security testing\nSecurity testing in CI/CD pipeline\nCompliance testing automation\nSecurity best practices and reporting'
WHERE slug = 'security-testing';

-- Update Test Frameworks category
UPDATE public.categories
SET description = 'Test frameworks provide the foundation for scalable and maintainable test automation. Learn how to design and implement robust test frameworks, understand different architectural patterns, and create solutions that can grow with your application.',
    overview = E'Test framework architecture and design patterns\nBehavior Driven Development (BDD)\nData-driven testing frameworks\nKeyword-driven frameworks\nHybrid framework development\nTest code organization and structure\nReporting and logging mechanisms\nCross-browser and cross-platform frameworks\nFramework maintenance and scaling\nBest practices and design principles'
WHERE slug = 'test-frameworks';

-- Update Database Testing category
UPDATE public.categories
SET description = 'Database testing ensures data integrity, performance, and reliability of your application''s data layer. Learn how to design and automate database tests, validate data consistency, and implement effective testing strategies for different database systems.',
    overview = E'Database testing fundamentals\nSQL and NoSQL database testing\nData validation strategies\nDatabase performance testing\nTesting stored procedures and triggers\nData migration testing\nBackup and recovery testing\nDatabase security testing\nAutomating database tests\nBest practices for database testing'
WHERE slug = 'database-testing'; 