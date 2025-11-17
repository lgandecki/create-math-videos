from manim import *
import numpy as np

class PiVisualizationScene(Scene):
    def construct(self):
        # Title
        title = Text("Visualizing π = C / D", font_size=48)
        self.play(FadeIn(title))
        self.wait(1)
        self.play(title.animate.to_edge(UP))

        # Setup circle and line
        radius = ValueTracker(1)
        circle = always_redraw(lambda: Circle(radius=radius.get_value(), color=BLUE))
        diam = always_redraw(lambda: Line(
            LEFT * radius.get_value(), RIGHT * radius.get_value(), color=YELLOW
        ))
        circ_line = always_redraw(lambda: Line(
            DOWN*(radius.get_value()+0.5),
            DOWN*(radius.get_value()+0.5) + RIGHT*(2*radius.get_value()*3.14),
            color=GREEN
        ))
        d_label = always_redraw(lambda: MathTex(
            f"D = 2r = {2*radius.get_value():.2f}"
        ).next_to(diam, DOWN))
        c_label = always_redraw(lambda: MathTex(
            f"C = πD = {3.14*2*radius.get_value():.2f}"
        ).next_to(circ_line, UP))

        self.play(Create(circle), Create(diam), Create(circ_line))
        self.play(Write(d_label), Write(c_label))
        self.wait(1)

        for tgt in [1.5, 0.7, 2.0]:
            self.play(radius.animate.set_value(tgt), run_time=2)
            self.wait(1)

        self.play(FadeOut(circle, diam, circ_line, d_label, c_label, title))
        self.wait(1)


class WheatChessboardScene(Scene):
    def construct(self):
        # Draw 8×8 chessboard
        size = 6
        sq_size = size/8
        board = VGroup(*[
            Square(side_length=sq_size).set_fill(WHITE if (r+c)%2==0 else GRAY, 1).move_to(
                RIGHT*((c-3.5)*sq_size) + UP*((3.5-r)*sq_size)
            )
            for r in range(8) for c in range(8)
        ])
        self.play(DrawBorderThenFill(board))
        self.wait(1)

        # helper: place n small dots in a grid inside square
        def place_dots(n, square):
            dots = VGroup(*[Dot(radius=0.03, color=YELLOW) for _ in range(n)])
            rows = int(np.ceil(n/5))
            dots.arrange_in_grid(rows=rows, buff=0.05)
            dots.move_to(square.get_center())
            return dots

        # first 8 squares labels/grains
        for i in range(1,9):
            sq = board[i-1]
            grains = 2**(i-1)
            if grains <= 4:
                self.play(FadeIn(place_dots(grains, sq)), run_time=0.5)
            label = Text(f"{grains}", font_size=24).next_to(sq, DOWN)
            self.play(Write(label), run_time=0.3)
        self.play(Indicate(board[7], scale_factor=1.2))
        self.wait(1)

        # Square 20 dramatic pause
        self.play(FadeOut(*self.mobjects), run_time=1)
        sq20_label = Text("Square 20", font_size=48)
        self.play(Write(sq20_label))
        self.wait(1)
        self.play(FadeOut(sq20_label))

        # Draw cart: box + two wheels
        def make_cart():
            body = Rectangle(width=2, height=1, fill_color=BROWN, fill_opacity=1)
            wheel1 = Circle(radius=0.3).move_to(body.get_corner(DL) + np.array([0.4, -0.3, 0]))
            wheel2 = Circle(radius=0.3).move_to(body.get_corner(DR) + np.array([-0.4, -0.3, 0]))
            return VGroup(body, wheel1, wheel2)

        carts = VGroup(*[make_cart() for _ in range(3)]).arrange(RIGHT, buff=0.5)
        pile20_text = Text("Over 500,000 grains!", font_size=36, color=RED)
        self.play(Write(pile20_text))
        self.play(FadeIn(carts), run_time=1)
        self.wait(1)
        self.play(FadeOut(pile20_text, carts))

        # Accelerate through 21–30
        fast_nums = [f"{2**(i-1):,}" for i in range(21,31)]
        fast = Text(" … ".join(fast_nums), font_size=24)
        self.play(Write(fast), run_time=2)
        self.wait(1)
        self.play(FadeOut(fast))

        # Highlight square 30
        sq30_text = Text("Square 30:\nOver 500 million grains!", font_size=36, color=ORANGE)
        self.play(Write(sq30_text))
        self.wait(1)

        # Draw warehouse: big box + roof
        warehouse = VGroup(
            Rectangle(width=4, height=2, fill_color=GRAY, fill_opacity=1),
            Polygon(
                [-2,1,0], [2,1,0], [0,2,0],
                fill_color=LIGHT_GRAY, fill_opacity=1
            )
        )
        self.play(FadeIn(warehouse), run_time=1)
        self.wait(1)
        self.play(FadeOut(sq30_text, warehouse))

        # Square 40
        sq40_text = Text("Square 40:\nOver 500 billion grains!", font_size=36, color=PURPLE)
        self.play(Write(sq40_text))
        self.wait(1)

        # Draw mountain: triangle + snow cap
        mountain = VGroup(
            Polygon([-2,-1,0], [0,2,0], [2,-1,0], fill_color=WHITE, fill_opacity=1),
            Polygon([0,2,0], [-0.5,1,0], [0.5,1,0], fill_color=LIGHT_GRAY, fill_opacity=1)
        ).scale(1.5)
        self.play(FadeIn(mountain), run_time=1)
        self.wait(1)

        # Zoom out & contrast
        contrast = VGroup(
            Text("1–8 vs 20 vs 30 vs 40", font_size=36),
            Text("Exponential growth:\ndeceptively small → enormous", font_size=28)
        ).arrange(DOWN)
        self.play(self.camera.frame.animate.set(width=board.width*5), Write(contrast))
        self.wait(2)

        # Conclusion
        conclusion = Text(
            "This is exponential growth.\n"
            "Small at first, then shockingly enormous.\n\n"
            "Where else in your life\n"
            "might exponential growth\n"
            "be quietly at work?",
            font_size=30
        )
        self.play(FadeOut(contrast), Write(conclusion))
        self.wait(3)
        self.play(FadeOut(conclusion))

