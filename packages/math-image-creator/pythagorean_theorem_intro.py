from manim import *
import numpy as np

class PythagoreanTheoremIntro(Scene):
    def construct(self):
        # Create title
        title = Text("The Pythagorean Theorem", font_size=48, color=BLUE)
        title.to_edge(UP)
        
        # Display the title
        self.play(Write(title))
        self.wait(1)
        
        # Create a right-angled triangle
        # Define vertices for a right triangle
        A = np.array([-2, -1, 0])  # Bottom left (right angle)
        B = np.array([2, -1, 0])   # Bottom right
        C = np.array([-2, 2, 0])   # Top left
        
        # Create triangle using Polygon
        triangle = Polygon(A, B, C, color=YELLOW, fill_opacity=0.3)
        triangle.set_stroke(YELLOW, width=3)
        
        # Create right angle square symbol
        right_angle_size = 0.3
        square_corner = Square(side_length=right_angle_size, color=WHITE)
        square_corner.move_to(A + np.array([right_angle_size/2, right_angle_size/2, 0]))
        
        # Add labels for sides
        label_a = MathTex("a", color=GREEN, font_size=36)
        label_b = MathTex("b", color=GREEN, font_size=36) 
        label_c = MathTex("c", color=RED, font_size=36)
        
        # Position labels at the middle of each side
        label_a.next_to(Dot().move_to((A + C) / 2), LEFT)
        label_b.next_to(Dot().move_to((A + B) / 2), DOWN)
        label_c.next_to(Dot().move_to((B + C) / 2), RIGHT)
        
        # Animate the triangle creation
        self.play(Create(triangle))
        self.wait(0.5)
        
        # Highlight the right angle with square symbol
        self.play(Create(square_corner))
        self.wait(0.5)
        
        # Add side labels
        self.play(Write(label_a), Write(label_b), Write(label_c))
        self.wait(1)
        
        # Create and display the formula
        formula = MathTex(r"a^2 + b^2 = c^2", font_size=48, color=WHITE)
        formula.to_edge(DOWN, buff=1)
        
        self.play(Write(formula))
        self.wait(2)
        
        # Final pause
        self.wait(1)