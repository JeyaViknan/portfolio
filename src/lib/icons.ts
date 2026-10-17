import {
  siApachekafka, siCloudflarepages, siCodechef, siCplusplus, siDocker, siFastapi, siGithub, siGithubactions,
  siGrafana, siHuggingface, siJavascript, siJunit5, siKubernetes, siLeetcode, siMongodb, siMysql, siNextdotjs,
  siNodedotjs, siNumpy, siOnnx, siOpenjdk, siPandas, siPostgresql, siPrisma, siPrometheus, siPytest, siPython,
  siPytorch, siReact, siRedis, siRust, siScikitlearn, siSpringboot, siSwift, siTauri, siTypescript,
} from 'simple-icons';

import arrowUpRight from 'lucide-static/icons/arrow-up-right.svg?raw';
import arrowRight from 'lucide-static/icons/arrow-right.svg?raw';
import arrowLeft from 'lucide-static/icons/arrow-left.svg?raw';
import mail from 'lucide-static/icons/mail.svg?raw';
import fileText from 'lucide-static/icons/file-text.svg?raw';
import mapPin from 'lucide-static/icons/map-pin.svg?raw';
import copy from 'lucide-static/icons/copy.svg?raw';
import award from 'lucide-static/icons/award.svg?raw';

type Brand = { path: string; hex: string };

// Brand marks from Simple Icons. Entries without an icon render as text.
export const tech: Record<string, { label: string; icon?: Brand }> = {
  python: { label: 'Python', icon: siPython },
  typescript: { label: 'TypeScript', icon: siTypescript },
  javascript: { label: 'JavaScript', icon: siJavascript },
  java: { label: 'Java', icon: siOpenjdk },
  cplusplus: { label: 'C++', icon: siCplusplus },
  sql: { label: 'SQL' },
  fastapi: { label: 'FastAPI', icon: siFastapi },
  springboot: { label: 'Spring Boot', icon: siSpringboot },
  nodedotjs: { label: 'Node.js', icon: siNodedotjs },
  nextdotjs: { label: 'Next.js', icon: siNextdotjs },
  react: { label: 'React', icon: siReact },
  prisma: { label: 'Prisma', icon: siPrisma },
  pytorch: { label: 'PyTorch', icon: siPytorch },
  huggingface: { label: 'Hugging Face', icon: siHuggingface },
  scikitlearn: { label: 'scikit-learn', icon: siScikitlearn },
  pandas: { label: 'pandas', icon: siPandas },
  numpy: { label: 'NumPy', icon: siNumpy },
  faiss: { label: 'FAISS' },
  postgresql: { label: 'PostgreSQL', icon: siPostgresql },
  redis: { label: 'Redis', icon: siRedis },
  mysql: { label: 'MySQL', icon: siMysql },
  mongodb: { label: 'MongoDB', icon: siMongodb },
  apachekafka: { label: 'Kafka', icon: siApachekafka },
  docker: { label: 'Docker', icon: siDocker },
  kubernetes: { label: 'Kubernetes', icon: siKubernetes },
  githubactions: { label: 'GitHub Actions', icon: siGithubactions },
  prometheus: { label: 'Prometheus', icon: siPrometheus },
  grafana: { label: 'Grafana', icon: siGrafana },
  pytest: { label: 'PyTest', icon: siPytest },
  junit5: { label: 'JUnit 5', icon: siJunit5 },
  onnx: { label: 'ONNX', icon: siOnnx },
  cloudflarepages: { label: 'Cloudflare Pages', icon: siCloudflarepages },
  tauri: { label: 'Tauri', icon: siTauri },
  rust: { label: 'Rust', icon: siRust },
  swift: { label: 'SwiftUI', icon: siSwift },
  asyncio: { label: 'asyncio' },
  graphrag: { label: 'GraphRAG' },
};

export const brands = { github: siGithub, codechef: siCodechef, leetcode: siLeetcode, mongodb: siMongodb };

// UI icons from Lucide, as raw SVG strings.
export const ui = { arrowUpRight, arrowRight, arrowLeft, mail, fileText, mapPin, copy, award };
