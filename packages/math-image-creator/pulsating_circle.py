from manim import *

class PulsatingCircle(Scene):
    def construct(self):
        # Create a square
        square = Square(side_length=4, color=BLUE, stroke_width=4)
        
        # Create a circle that fits inside the square
        circle = Circle(radius=1.5, color=RED, fill_opacity=0.5)
        
        # Add both shapes to the scene
        self.play(Create(square))
        self.play(Create(circle))
        
        # Create the pulsating animation
        # The circle will scale up and down repeatedly
        self.play(
            circle.animate.scale(1.3),
            rate_func=there_and_back,
            run_time=1
        )
        
        # Repeat the pulsation several times
        for _ in range(5):
            self.play(
                circle.animate.scale(1.2),
                rate_func=there_and_back,
                run_time=0.8
            )
        
        # Hold the final frame
        self.wait(1)