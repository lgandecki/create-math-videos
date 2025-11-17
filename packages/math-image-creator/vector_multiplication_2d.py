from manim import *

class VectorMultiplication2D(Scene):
    def construct(self):
        # Create grid with axes
        grid = NumberPlane(
            x_range=[-5, 5, 1],
            y_range=[-5, 5, 1],
            x_length=10,
            y_length=10,
            background_line_style={
                "stroke_color": GRAY,
                "stroke_width": 1,
                "stroke_opacity": 0.5,
            },
            axis_config={
                "stroke_color": WHITE,
                "stroke_width": 2,
                "include_numbers": True,
                "include_tip": True,
                "tip_length": 0.2,
                "font_size": 24,
                "numbers_with_elongated_ticks": [-4, -3, -2, -1, 1, 2, 3, 4],
                "longer_tick_multiple": 0.5,
            },
            x_axis_config={
                "numbers_to_include": [-4, -3, -2, -1, 1, 2, 3, 4],
            },
            y_axis_config={
                "numbers_to_include": [-4, -3, -2, -1, 1, 2, 3, 4],
            }
        )
        
        # Add axis labels
        x_label = MathTex("x", font_size=30)
        x_label.next_to(grid.x_axis.get_end(), RIGHT)
        y_label = MathTex("y", font_size=30)
        y_label.next_to(grid.y_axis.get_end(), UP)
        
        # Create vectors
        vector_a = Arrow(
            start=ORIGIN,
            end=3*RIGHT + 2*UP,
            color=BLUE,
            buff=0,
            stroke_width=6
        )
        
        vector_b = Arrow(
            start=ORIGIN,
            end=2*RIGHT + 3*UP,
            color=RED,
            buff=0,
            stroke_width=6
        )
        
        # Labels
        label_a = MathTex("\\vec{a} = (3, 2)", color=BLUE, font_size=36)
        label_a.next_to(vector_a.get_end(), UR, buff=0.2)
        
        label_b = MathTex("\\vec{b} = (2, 3)", color=RED, font_size=36)
        label_b.next_to(vector_b.get_end(), UL, buff=0.2)
        
        # Title
        title = Text("Iloczyn skalarny wektorów", font_size=40)
        title.to_edge(UP)
        
        # Show grid and title
        self.play(Create(grid), Write(title))
        self.play(Write(x_label), Write(y_label))
        self.wait(0.5)
        
        # Show vectors
        self.play(
            GrowArrow(vector_a),
            Write(label_a),
            run_time=1
        )
        self.play(
            GrowArrow(vector_b),
            Write(label_b),
            run_time=1
        )
        self.wait(1)
        
        # Dot product formula
        formula = MathTex(
            "\\vec{a} \\cdot \\vec{b} = a_x \\cdot b_x + a_y \\cdot b_y",
            font_size=36
        )
        formula.to_edge(DOWN).shift(UP*1.5)
        
        self.play(Write(formula))
        self.wait(0.5)
        
        # Calculate
        calculation = MathTex(
            "\\vec{a} \\cdot \\vec{b} = 3 \\cdot 2 + 2 \\cdot 3 = 6 + 6 = 12",
            font_size=36
        )
        calculation.next_to(formula, DOWN)
        
        self.play(Write(calculation))
        self.wait(1)
        
        # Show projection visualization
        projection_line = DashedLine(
            ORIGIN,
            vector_a.get_end(),
            color=YELLOW,
            stroke_width=4
        )
        
        # Projection of b onto a
        proj_end = 12/13 * vector_a.get_end()
        projection = Arrow(
            start=ORIGIN,
            end=proj_end,
            color=YELLOW,
            buff=0,
            stroke_width=6
        )
        
        proj_text = Text("Projekcja", font_size=24, color=YELLOW)
        proj_text.next_to(projection.get_end(), RIGHT)
        
        self.play(Create(projection_line))
        self.play(
            GrowArrow(projection),
            Write(proj_text)
        )
        
        self.wait(2)