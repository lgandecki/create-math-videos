from manim import *

class NumberLineStartPoint(Scene):
    def construct(self):
        # Create a number line from -2 to 10
        number_line = NumberLine(
            x_range=[-2, 10, 1],
            length=10,
            color=WHITE,
            include_numbers=True,
            label_direction=DOWN,
            font_size=36
        )
        
        # Position the number line in the center
        number_line.move_to(ORIGIN)
        
        # Add title
        title = Text("How it Works", font_size=64, color=WHITE)
        title.to_edge(UP, buff=1)
        
        # Starting point at position 2
        starting_point = 2
        dot = Dot(
            number_line.number_to_point(starting_point),
            color=RED,
            radius=0.1
        )
        
        # Explanation text
        explanation = Text(
            "The first number tells us where to START on the line.",
            font_size=36,
            color=WHITE
        )
        explanation.to_edge(DOWN, buff=1)
        
        # Arrow pointing to the starting point
        arrow = Arrow(
            start=number_line.number_to_point(starting_point) + UP * 0.8,
            end=number_line.number_to_point(starting_point) + UP * 0.2,
            color=YELLOW,
            stroke_width=4
        )
        
        # Label for the starting point
        start_label = Text(f"Start: {starting_point}", font_size=24, color=YELLOW)
        start_label.next_to(arrow, UP, buff=0.1)
        
        # Animation sequence
        self.play(Write(title))
        self.wait(1)
        
        self.play(Create(number_line))
        self.wait(1)
        
        self.play(Write(explanation))
        self.wait(1)
        
        self.play(
            Create(dot),
            Create(arrow),
            Write(start_label)
        )
        self.wait(2)
        
        # Highlight the starting point
        self.play(
            dot.animate.scale(1.5),
            rate_func=there_and_back,
            run_time=1
        )
        self.wait(2)