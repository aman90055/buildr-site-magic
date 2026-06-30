import { Calculator } from "lucide-react";
import AITextTool from "@/components/AITextTool";

const AIMathSolver = () => (
  <AITextTool
    title="AI Math Solver"
    description="Solve math problems step-by-step — from algebra to calculus and word problems."
    metaTitle="AI Math Solver - Step by Step Solutions | Document Edit Pro"
    metaDescription="Solve algebra, calculus, geometry, and word problems with full step-by-step solutions."
    icon={Calculator}
    gradient="from-pink-500 to-rose-600"
    systemPrompt="You are an expert math tutor. Solve the user's math problem step-by-step. Show every step clearly with brief explanations, then give the final answer in **bold**. Use LaTeX-style notation only when essential, otherwise plain text. If the problem is ambiguous, state your assumption."
    inputLabel="Math problem"
    inputPlaceholder="Solve: 2x^2 + 5x - 3 = 0"
    outputLabel="Step-by-step Solution"
    actionLabel="Solve"
  />
);

export default AIMathSolver;
