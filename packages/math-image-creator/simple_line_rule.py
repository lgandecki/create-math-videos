from manim import *

class SimpleLineRule(Scene):
    def construct(self):
        # Display the title "The Simple Line Rule"
        title = Text("The Simple Line Rule", font_size=48, color=BLUE)
        title.to_edge(UP, buff=1)
        
        self.play(Write(title))
        self.wait(1)
        
        # Show the equation y = mx + b in the center of the screen
        equation = MathTex("y = mx + b", font_size=72, color=WHITE)
        equation.move_to(ORIGIN)
        
        self.play(Write(equation))
        self.wait(2)
        
        # Briefly explain that this single rule describes every straight line on a graph
        explanation = Text(
            "This single rule describes\nevery straight line on a graph",
            font_size=36,
            color=YELLOW,
            line_spacing=1.2
        )
        explanation.next_to(equation, DOWN, buff=1)
        
        self.play(Write(explanation))
        self.wait(3)
        
        # Hold the final scene
        self.wait(2)