from manim import *

class VectorAdditionConclusion(Scene):
    def construct(self):
        # Title
        title = Text("Vector Addition: Conclusion", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Main heading
        summary_heading = Text("Two Key Ways to Add Vectors:", font_size=36, color=YELLOW)
        summary_heading.shift(UP * 2)
        self.play(Write(summary_heading))
        self.wait(1)
        
        # Method 1: Graphically
        method1_title = Text("1. Graphically: Tip-to-Tail", font_size=32, color=GREEN)
        method1_title.shift(UP * 0.5)
        self.play(Write(method1_title))
        self.wait(1)
        
        # Method 2: Analytically
        method2_title = Text("2. Analytically: Component-wise", font_size=32, color=GREEN)
        method2_title.shift(DOWN * 0.5)
        self.play(Write(method2_title))
        self.wait(1)
        
        # Key insight
        insight_text = Text("Breaking vectors into X and Y components", font_size=28, color=WHITE)
        insight_text2 = Text("simplifies addition on a plane", font_size=28, color=WHITE)
        insight_group = VGroup(insight_text, insight_text2)
        insight_group.arrange(DOWN, buff=0.2)
        insight_group.shift(DOWN * 2)
        
        self.play(Write(insight_text))
        self.wait(0.5)
        self.play(Write(insight_text2))
        self.wait(2)
        
        # Clear previous content
        self.play(FadeOut(summary_heading), FadeOut(method1_title), FadeOut(method2_title), 
                  FadeOut(insight_text), FadeOut(insight_text2))
        
        # Final summary equation
        equation_title = Text("Final Summary Equation:", font_size=36, color=YELLOW)
        equation_title.shift(UP * 1)
        self.play(Write(equation_title))
        self.wait(1)
        
        # The equation: R = (Ax + Bx, Ay + By)
        equation = Text("R = (Ax + Bx, Ay + By)", font_size=48, color=RED)
        equation.shift(DOWN * 0.5)
        
        # Create a box around the equation
        equation_box = SurroundingRectangle(equation, color=RED, buff=0.3)
        
        self.play(Write(equation))
        self.wait(1)
        self.play(Create(equation_box))
        self.wait(2)
        
        # Final emphasis
        final_text = Text("This is the foundation of vector addition!", font_size=28, color=WHITE)
        final_text.shift(DOWN * 2.5)
        self.play(Write(final_text))
        self.wait(3)