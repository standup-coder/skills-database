import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Skills4Coder',
  titleTemplate: ':title | Skills4Coder',
  description: '岗位即 Skills 集合，Agent 专业分工协作的编排框架',
  
  // Base URL
  base: '/',
  
  // Clean URLs
  cleanUrls: true,
  
  // Ignore dead links for now
  ignoreDeadLinks: true,
  
  // Language settings
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/'
    }
  },
  
  // Head
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'alternate icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#326CE5' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'zh_CN' }],
    ['meta', { name: 'og:site_name', content: 'Skills4Coder' }],
    ['meta', { name: 'og:image', content: '/og-image.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: '/og-image.png' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', rel: 'stylesheet' }]
  ],
  
  // Markdown
  markdown: {
    lineNumbers: true
  },
  
  // Theme configuration - CNCF Style
  themeConfig: {
    // Logo
    logo: { 
      src: '/logo.svg', 
      alt: 'Skills4Coder',
      width: 32,
      height: 32
    },
    
    siteTitle: 'Skills4Coder',
    
    // Navigation
    nav: [
      { 
        text: '文档',
        items: [
          { text: '核心概念', link: '/concepts/' },
          { text: '快速开始', link: '/getting-started/quickstart' },
          { text: '用户指南', link: '/guides/' },
          { text: '参考文档', link: '/reference/' }
        ]
      },
      { text: 'Roles', link: '/roles/' },
      { text: 'Skills', link: '/skills/' },
      { text: '生态', link: '/ecosystem/' }
    ],
    
    // Sidebar
    sidebar: {
      '/concepts/': [
        {
          text: '核心概念',
          items: [
            { text: '概述', link: '/concepts/' },
            { text: 'Role (岗位)', link: '/concepts/role-and-jd' }
          ]
        }
      ],
      '/getting-started/': [
        {
          text: '快速开始',
          items: [
            { text: '快速开始', link: '/getting-started/quickstart' }
          ]
        }
      ]
    },
    
    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/standup-coder/skills4coder' }
    ],
    
    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Skills4Coder Contributors'
    },
    
    // Search
    search: {
      provider: 'local'
    }
  },
  
  // Vite configuration
  vite: {
    resolve: {
      alias: {
        '@': '/.vitepress'
      }
    }
  }
})
