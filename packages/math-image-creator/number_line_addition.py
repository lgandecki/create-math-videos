from manim import *

class NumberLineAddition(Scene):
    def construct(self):
        # Create the number line
        number_line = NumberLine(
            x_range=[-1, 8, 1],
            length=10,
            include_numbers=True,
            numbers_to_include=range(-1, 9),
            label_direction=DOWN,
        )
        
        # Position the number line
        number_line.move_to(ORIGIN)
        
        # Add the number line to the scene
        self.play(Create(number_line))
        self.wait(0.5)
        
        # Create a point at position 2
        start_point = Dot(number_line.number_to_point(2), color=BLUE, radius=0.15)
        start_label = Text("Start at 2", font_size=24, color=BLUE)
        start_label.next_to(start_point, UP, buff=0.3)
        
        # Show the starting point
        self.play(FadeIn(start_point), Write(start_label))
        self.wait(1)
        
        # Create an arrow for the jump
        arrow_start = number_line.number_to_point(2)
        arrow_end = number_line.number_to_point(5)
        
        # Create a curved arrow to show the jump
        jump_arrow = CurvedArrow(
            arrow_start + UP * 0.3,
            arrow_end + UP * 0.3,
            angle=PI/3,
            color=GREEN,
            stroke_width=4
        )
        
        # Add text to show we're adding 3
        jump_label = Text("+ 3", font_size=24, color=GREEN)
        jump_label.next_to(jump_arrow, UP, buff=0.1)
        
        # Show the jump arrow
        self.play(Create(jump_arrow), Write(jump_label))
        self.wait(0.5)
        
        # Create dots and labels for intermediate positions
        intermediate_dots = []
        intermediate_labels = []
        
        for i in range(3, 6):  # positions 3, 4, 5
            dot = Dot(number_line.number_to_point(i), color=YELLOW, radius=0.1)
            label = Text(str(i), font_size=20, color=YELLOW)
            label.next_to(dot, UP * 2, buff=0.2)
            intermediate_dots.append(dot)
            intermediate_labels.append(label)
        
        # Animate the progression through numbers 3, 4, 5
        for i, (dot, label) in enumerate(zip(intermediate_dots, intermediate_labels)):
            if i < 2:  # For positions 3 and 4, show briefly then fade
                self.play(FadeIn(dot), Write(label), run_time=0.5)
                self.wait(0.3)
                self.play(FadeOut(dot), FadeOut(label), run_time=0.3)
            else:  # For position 5, keep it visible
                self.play(FadeIn(dot), Write(label), run_time=0.5)
                self.wait(0.5)
        
        # Move the starting point to the final position
        final_point = Dot(number_line.number_to_point(5), color=RED, radius=0.15)
        
        # Transform the starting point to the final position
        self.play(
            Transform(start_point, final_point),
            FadeOut(start_label),
            run_time=1
        )
        
        # Create the final equation
        equation = MathTex("2 + 3 = 5", font_size=36, color=WHITE)
        equation.to_edge(UP, buff=1)
        
        # Show the final equation
        self.play(Write(equation))
        self.wait(1)
        
        # Final label for the result
        result_label = Text("Final position: 5", font_size=24, color=RED)
        result_label.next_to(final_point, DOWN, buff=0.5)
        
        self.play(Write(result_label))
        self.wait(2)
        
        # Clean up - fade out intermediate elements but keep main elements
        self.play(
            FadeOut(jump_arrow),
            FadeOut(jump_label),
            FadeOut(intermediate_labels[-1]),
            FadeOut(intermediate_dots[-1])
        )
        self.wait(1)