from manim import *

class SimpleNumberLineAddition(Scene):
    def construct(self):
        # Display the title
        title = Text("Simple Number Line Addition", font_size=48, color=BLUE)
        title.to_edge(UP)
        
        self.play(Write(title))
        self.wait(2)
        
        # Create and show the number line
        number_line = NumberLine(
            x_range=[-5, 10, 1],
            length=10,
            color=WHITE,
            include_numbers=True,
            label_direction=DOWN,
            font_size=24
        )
        number_line.shift(DOWN * 0.5)
        
        # Animate the number line appearing
        self.play(Create(number_line))
        self.wait(1)
        
        # First explanation text
        explanation1 = Text(
            "A number line helps us see numbers\nand perform operations visually.",
            font_size=32,
            color=GREEN
        )
        explanation1.to_edge(DOWN, buff=1.5)
        
        self.play(Write(explanation1))
        self.wait(3)
        
        # Replace with second explanation
        explanation2 = Text(
            "This video will focus on using\nthe number line for addition.",
            font_size=32,
            color=YELLOW
        )
        explanation2.to_edge(DOWN, buff=1.5)
        
        self.play(Transform(explanation1, explanation2))
        self.wait(3)
        
        # Final pause
        self.wait(1)