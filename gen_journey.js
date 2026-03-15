const fs = require('fs');
const code = \import React, { useEffect, useRef, useState } from 'react';\n
import { useTimeTheme } from '@/hooks/useTimeTheme';\n
import { Card } from '@/components/ui/card';\n
import portfolioData from '@/data/portfolio.json';\n
import { palettes } from '@/constants/palettes';\n\n
export const JourneySection = () => {\n
  const { effectiveTheme, getTextClass, isDayOrAfternoon, getTimeBasedClass } = useTimeTheme();\n
  const { education, experience, extracurriculars } = portfolioData;\n
  const textClass = getTextClass();\n
  const isLightMode = isDayOrAfternoon();\n
  const timeBasedClass = getTimeBasedClass();\n\n
  const getThemePrimaryColor = () => {\n
    switch (effectiveTheme) {\n
      case 'dawn':\n      case 'preDawn': return palettes.preDawn.bottom;\n
      case 'sunrise': return palettes.sunrise.bottom;\n
      case 'morning':\n      case 'bright_day':\n      case 'day': return palettes.morning.top;\n
      case 'noon':\n      case 'warm_day': return palettes.noon.top;\n
      case 'afternoon': return palettes.afternoon.top;\n
      case 'sunset': return palettes.sunset.bottom;\n
      case 'dusk':\n      case 'twilight': return palettes.dusk.bottom;\n
      case 'night':\n      default: return '#7c3aed';\n
    }\n  };\n\n
  const primaryColor = getThemePrimaryColor();\n
  const allItems = [\n
    ...experience.map(item => ({ ...item, category: 'Work Experience' })),\n
    ...education.map(item => ({ ...item, category: 'Education' })),\n
    ...extracurriculars.map(item => ({ ...item, category: 'Volunteering' }))\n
  ];\n\n
  const scrollRef = useRef<HTMLDivElement>(null);\n
  const [activeLamp, setActiveLamp] = useState(false);\n\n
  useEffect(() => {\n
    const root = scrollRef.current;\n    if (!root) return;\n
    const observer = new IntersectionObserver((entries) => {\n
      let isVisible = false;\n
      entries.forEach(entry => { if (entry.isIntersecting) { isVisible = true; } });\n
      setActiveLamp(isVisible);\n
    }, { root: root, threshold: 0.3 });\n
    const items = root.querySelectorAll('.experience-item');\n
    items.forEach(el => observer.observe(el));\n
    return () => observer.disconnect();\n
  }, []);\n\n
  return (\n
      <div className={\container mx-auto max-w-5xl p-6 md:p-10 rounded-[2.5rem] backdrop-blur-md border shadow-2xl transition-all duration-500 flex flex-col items-center \\} style={{ '--theme-color': primaryColor } as React.CSSProperties}>\n
        <h2 className={\	ext-4xl font-bold text-center mb-10 transition-colors duration-300 \\}>My Experience</h2>\n
          {allItems.map((item, index) => (\n
            <Card key={\\-\\} className={\experience-item transition-all duration-500 \\}>\n
                    <div>\n
                      <h3 className={\	ext-xl font-bold transition-colors duration-300 \\}>{item.position || item.degree}</h3>\n
                      <p className={\	ext-lg font-semibold transition-colors duration-300 \\}>{item.company || item.institution || item.organization}</p>\n
                      <p className={\	ext-sm transition-colors duration-300 \ opacity-70\}>{item.duration} {item.location ? \• \\ : ''}</p>\n
                    </div>\n
                    <span className={\px-3 py-1 text-xs rounded-full font-medium \\}>{item.category}</span>\n
                  </div>\n
                </div>\n
                <p className={\mb-4 transition-colors duration-300 \ opacity-80\}>{item.description}</p>\n
                {item.achievements && item.achievements.length > 0 && (\n
                    <h4 className={\ont-semibold mb-3 transition-colors duration-300 \\}>Highlights:</h4>\n
                      {item.achievements.map((achievement, achIndex) => (\n
                        <li key={achIndex} className={\lex items-start transition-colors duration-300 \ opacity-80\}>\n
                          {achievement}\n
                        </li>\n
                      ))}\n
                    </ul>\n
                  </div>\n
                )}\n
              </div>\n
            </Card>\n
          ))}\n
        </div>\n\n
          <div className={\w-16 h-8 rounded-t-full z-10 transition-all duration-500 \\}></div>\n
          <div className={\w-2 h-10 z-10 transition-all duration-500 \\}></div>\n
          <div className={\w-20 h-2 rounded-t-lg z-10 transition-all duration-500 \\}></div>\n
            style={{ background: \\\, opacity: activeLamp ? (isLightMode ? 0.4 : 0.6) : (isLightMode ? 0.05 : 0.05), transform: activeLamp ? 'scale(1.1) translateY(-20px)' : 'scale(1) translateY(0)' }}\n
          ></div>\n
        </div>\n\n
      </div>\n
    </section>\n
  );\n};\n\;\n
fs.writeFileSync('src/components/JourneySection.tsx', code);\n
