from manim import *

class NumberLineConclusion(Scene):
    def construct(self):
        # Create number line
        number_line = NumberLine(
            x_range=[-10, 10, 1],
            length=12,
            color=BLUE,
            include_numbers=True,
            label_direction=DOWN,
            font_size=24
        )
        
        # Position number line
        number_line.move_to(ORIGIN + DOWN * 2)
        
        # Add number line to scene (it will be displayed throughout)
        self.add(number_line)
        
        # Wait a moment for number line to be visible
        self.wait(1)
        
        # Create summary messages
        title_text = Text(
            "The number line: A simple visual for complex math.",
            font_size=36,
            color=WHITE
        ).move_to(UP * 2)
        
        addition_text = Text(
            "Addition: Start and jump.",
            font_size=32,
            color=GREEN
        ).move_to(UP * 0.5)
        
        multiplication_text = Text(
            "Multiplication: Repeated jumps from zero.",
            font_size=32,
            color=YELLOW
        ).move_to(DOWN * 0.5)
        
        # Display messages one by one
        self.play(Write(title_text))
        self.wait(1)
        
        self.play(Write(addition_text))
        self.wait(1)
        
        self.play(Write(multiplication_text))
        self.wait(2)
        
        # Fade out everything
        self.play(
            FadeOut(title_text),
            FadeOut(addition_text),
            FadeOut(multiplication_text),
            FadeOut(number_line)
        )
        
        self.wait(1)