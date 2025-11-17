from manim import *

class NumberLineAdditionExample(Scene):
    def construct(self):
        # Create equation at the top
        equation = MathTex("2 + 3 = ?").scale(1.2)
        equation.to_edge(UP, buff=1)
        
        # Create number line
        number_line = NumberLine(
            x_range=[-1, 6, 1],
            length=10,
            color=WHITE,
            include_numbers=True,
            label_direction=DOWN,
            font_size=36
        )
        number_line.shift(DOWN * 0.5)
        
        # Create marker/point at position 2
        marker = Dot(color=BLUE, radius=0.15)
        marker.move_to(number_line.number_to_point(2))
        
        # Create text "Start at 2"
        start_text = Text("Start at 2.", font_size=32, color=BLUE)
        start_text.next_to(marker, UP, buff=0.5)
        
        # Animation sequence
        self.play(Write(equation))
        self.wait(1)
        
        self.play(Create(number_line))
        self.wait(1)
        
        self.play(FadeIn(marker))
        self.wait(0.5)
        
        self.play(Write(start_text))
        self.wait(2)