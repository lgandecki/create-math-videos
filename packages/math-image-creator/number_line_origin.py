from manim import *

class NumberLineOrigin(Scene):
    def construct(self):
        # Create a horizontal line
        line = Line(start=LEFT*4, end=RIGHT*4, color=BLUE)
        
        # Create the origin point
        origin_dot = Dot(ORIGIN, color=RED, radius=0.1)
        
        # Create the "0" label
        zero_label = Text("0", font_size=24, color=WHITE).next_to(origin_dot, DOWN, buff=0.3)
        
        # Animation sequence
        self.play(Create(line), run_time=2)
        self.wait(0.5)
        self.play(FadeIn(origin_dot), run_time=1)
        self.wait(0.5)
        self.play(Write(zero_label), run_time=1)
        self.wait(2)