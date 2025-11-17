from manim import *

class PythagoreanTheoremConclusion(Scene):
    def construct(self):
        # Create right-angled triangle
        # Using coordinates to ensure it's a right triangle
        triangle_vertices = [
            [-3, -1, 0],  # Bottom left
            [2, -1, 0],   # Bottom right  
            [-3, 2, 0]    # Top left
        ]
        
        triangle = Polygon(*triangle_vertices, color=BLUE, fill_opacity=0.2, stroke_width=3)
        
        # Create labels for the sides
        # Side 'a' (vertical side)
        label_a = MathTex("a", color=RED, font_size=36)
        label_a.next_to([-3, 0.5, 0], LEFT)
        
        # Side 'b' (horizontal side) 
        label_b = MathTex("b", color=GREEN, font_size=36)
        label_b.next_to([-0.5, -1, 0], DOWN)
        
        # Side 'c' (hypotenuse)
        label_c = MathTex("c", color=YELLOW, font_size=36)
        label_c.next_to([-0.5, 0.5, 0], UP + RIGHT, buff=0.1)
        
        # Create right angle indicator
        right_angle_size = 0.3
        right_angle = VGroup(
            Line([-3 + right_angle_size, -1, 0], [-3 + right_angle_size, -1 + right_angle_size, 0]),
            Line([-3 + right_angle_size, -1 + right_angle_size, 0], [-3, -1 + right_angle_size, 0])
        ).set_color(WHITE)
        
        # Group triangle elements
        triangle_group = VGroup(triangle, label_a, label_b, label_c, right_angle)
        
        # Display the triangle with labels
        self.play(Create(triangle))
        self.wait(0.5)
        self.play(Write(label_a), Write(label_b), Write(label_c))
        self.play(Create(right_angle))
        self.wait(1)
        
        # Bring back the formula
        formula = MathTex("a^2 + b^2 = c^2", font_size=48)
        formula.to_edge(UP, buff=1)
        formula.set_color_by_tex("a^2", RED)
        formula.set_color_by_tex("b^2", GREEN) 
        formula.set_color_by_tex("c^2", YELLOW)
        
        self.play(Write(formula))
        self.wait(1)
        
        # Display concluding message
        conclusion_text = Text(
            "The Pythagorean Theorem helps find unknown\nside lengths in any right-angled triangle.",
            font_size=32
        )
        conclusion_text.to_edge(DOWN, buff=1)
        
        self.play(Write(conclusion_text))
        self.wait(2)
        
        # Final highlight animation
        self.play(
            triangle.animate.set_stroke(color=YELLOW, width=5),
            Circumscribe(formula, color=YELLOW, fade_out=True),
            run_time=2
        )
        
        self.wait(2)