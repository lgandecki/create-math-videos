from manim import *

class SimpleManim(Scene):
    def construct(self):
        # Create a simple circle
        circle = Circle(radius=2, color=BLUE)
        
        # Create a square
        square = Square(side_length=3, color=RED)
        
        # Create text without LaTeX
        text = Text("Hello Manim!", font_size=48)
        
        # Animate the shapes
        self.play(Create(circle))
        self.wait(1)
        
        self.play(Transform(circle, square))
        self.wait(1)
        
        self.play(FadeOut(square))
        self.play(Write(text))
        self.wait(2)