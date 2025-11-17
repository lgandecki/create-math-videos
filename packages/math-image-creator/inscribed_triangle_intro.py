from manim import *
import numpy as np

class InscribedTriangleIntro(Scene):
    def construct(self):
        # Create a square
        square = Square(
            side_length=4,
            color=BLUE,
            fill_opacity=0.3,
            stroke_width=3
        )
        
        # Display the square
        self.play(Create(square), run_time=2)
        self.wait(1)
        
        # Create a triangle with vertices on the square's perimeter
        # Position vertices at different points on the square's edges
        square_points = square.get_vertices()
        
        # Define triangle vertices on the square's perimeter
        # Top edge - slightly right of center
        vertex1 = np.array([0.8, 2, 0])
        # Right edge - middle
        vertex2 = np.array([2, 0, 0])
        # Bottom edge - left of center  
        vertex3 = np.array([-1.2, -2, 0])
        
        triangle = Polygon(
            vertex1, vertex2, vertex3,
            color=RED,
            fill_opacity=0.6,
            stroke_width=3
        )
        
        # Animate the triangle appearing
        self.play(DrawBorderThenFill(triangle), run_time=2)
        self.wait(1)
        
        # Add dots at the vertices to emphasize they're on the perimeter
        dot1 = Dot(vertex1, color=YELLOW, radius=0.1)
        dot2 = Dot(vertex2, color=YELLOW, radius=0.1)
        dot3 = Dot(vertex3, color=YELLOW, radius=0.1)
        
        self.play(
            FadeIn(dot1),
            FadeIn(dot2),
            FadeIn(dot3),
            run_time=1
        )
        self.wait(1)
        
        # Pose the question
        question = Text(
            "How do we find the area\nof this inscribed triangle?",
            font_size=36,
            color=WHITE
        )
        question.to_edge(DOWN, buff=1)
        
        self.play(Write(question), run_time=3)
        self.wait(3)
        
        # Optional: Add some emphasis by highlighting the triangle
        self.play(
            triangle.animate.set_fill(opacity=0.8),
            run_time=1
        )
        self.wait(2)